import { Box3, BoxBufferGeometry, BufferAttribute, BufferGeometry, CylinderBufferGeometry, CylinderGeometry, DoubleSide, EdgesGeometry, EventDispatcher, ExtrudeBufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial, LineCurve3, LineSegments, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, Object3D, Path, Scene, Shape, ShapeBufferGeometry, Vector2, Vector3 } from "three";
import { BIMAIMesh } from "./BIMAIMesh";
import { MeshControlconst } from "./meshControlconst";

export class MeshControlUtils extends EventDispatcher{
    private static _BimMeshControlManager:MeshControlUtils;
    public static get single():MeshControlUtils {
        if(this._BimMeshControlManager == null){
            this._BimMeshControlManager = new MeshControlUtils();
        }
        return this._BimMeshControlManager;
    }

    /**
     * 挤压几何体应用生成
     * vecs 可以是一组点,也可以是长宽 type 1是点2是长宽  默认是1
     * ishole是否要扣洞
     */
    public extrudeBufferGeometry(vecs:any[],depth:number=0,ishole:boolean=false,type:number=1):BufferGeometry{
        let i:number,j:number;
        let arr = [];
        if(type === 1){
            for(i=0;i<vecs.length;i++){
                arr.push(new Vector2(vecs[i].x,vecs[i].y));
            }
        }else{
            arr.push(new Vector2(-vecs[0]/2,-vecs[1]/2));
            arr.push(new Vector2(-vecs[0]/2,vecs[1]/2));
            arr.push(new Vector2(vecs[0]/2,vecs[1]/2));
            arr.push(new Vector2(vecs[0]/2,-vecs[1]/2));
        }
        var squareShape = new Shape(arr); 
        if(ishole){
            var squareShapePath = new Path();
            // squareShapePath.moveTo( 10, 10 );
            // squareShapePath.lineTo( 10, height -10); 
            // squareShapePath.lineTo( wdth - 10, height - 10);
            // squareShapePath.lineTo( wdth -10 , 10 );
            // squareShapePath.lineTo( 10, 10 );
            squareShape.holes.push( squareShapePath );// 挖洞

        }
        var extrudeSettings = { depth: depth, bevelEnabled: false, bevelSegments: 1, bevelThickness: 0.2 };
        var geometry = new ExtrudeBufferGeometry( squareShape, extrudeSettings );
        // ExtrudeBufferGeometry转换BufferGeometry
        var bGeometry = new BufferGeometry();
        // bGeometry.attributes.normal = geometry.attributes.normal;
        bGeometry.attributes.position = geometry.attributes.position;
        bGeometry.attributes.uv = geometry.attributes.uv;
        // bGeometry.translate(0,sqwidth/2,0);
        // bGeometry.center();
                // bGeometry.attributes.uv = new THREE.Float32BufferAttribute( geometry.attributes.uv.array.slice(0,48), 2);
                // let idx2:ArrayLike<number>;
                // let arrayyy = [];
                // for(let i=0;i<bGeometry.attributes.uv.array.length;i++){
                //     let num = bGeometry.attributes.uv.array[i];
                //     // if(i > 5){
                //     //     num = 0;
                //     // }
                //     arrayyy.push(num);
                    
                // }
                // let tempvertices = new Float32Array(arrayyy);
                // bGeometry.attributes.uv = new THREE.BufferAttribute(tempvertices, 2); 
                // for (idx2 in bGeometry.attributes.uv.array) {
                //     if (idx2 > 5) {
                //         bGeometry.attributes.uv.array[idx2] = 0;
                //         bGeometry.attributes.uv.array[idx2] = 0;
                //     }
                // }
        return bGeometry;
    }

    /**
     * 形状平面几何体应用生成
     * vecs 可以是一组点,也可以是长宽 type 1是点2是长宽  默认是1
     */
    private shapeBufferGeometry(vecs:any[],type:number=1):ShapeBufferGeometry{
        let i:number,j:number;
        let arr = [];
        if(type === 1){
            for(i=0;i<vecs.length;i++){
                arr.push(new Vector2(vecs[i].x,vecs[i].y));
            }
        }else{
            arr.push(new Vector2(-vecs[0]/2,-vecs[1]/2));
            arr.push(new Vector2(-vecs[0]/2,vecs[1]/2));
            arr.push(new Vector2(vecs[0]/2,vecs[1]/2));
            arr.push(new Vector2(vecs[0]/2,-vecs[1]/2));
        }
        var squareShape = new Shape(arr); 
        var geometry = new ShapeBufferGeometry( squareShape );
        return geometry;
    }


    /**
     * 合并几何体
     */
    public mergeBufferGeometry(meshs:any[]):BufferGeometry{
        const sumPosArr = new Array();
        const sumNormArr = new Array();
        const sumUvArr = new Array();
        const modelGeometry = new BufferGeometry();
        let sumPosCursor = 0;
        let sumNormCursor = 0;
        let sumUvCursor = 0;
        let startGroupCount = 0;
        let lastGroupCount = 0;
        for (let a = 0; a < meshs.length; a++ )
        {
            let tempgeom = (meshs[a].geometry as BufferGeometry);
            const posAttArr = tempgeom.getAttribute('position').array;
            for (let b = 0; b < posAttArr.length; b++)
            {
                sumPosArr[b + sumPosCursor] = posAttArr[b];
            }
            sumPosCursor += posAttArr.length;
            if(!tempgeom.getAttribute('normal'))
            {
                tempgeom.computeVertexNormals();//面片法向量的平均值计算每个顶点的法向量。
            }
            const numAttArr = tempgeom.getAttribute('normal').array;
            for (let b = 0; b < numAttArr.length; b++)
            {
                sumNormArr[b + sumNormCursor] = numAttArr[b];
            }
            sumNormCursor += numAttArr.length;
            const uvAttArr = tempgeom.getAttribute('uv').array;
            for (let b = 0; b < uvAttArr.length; b++)
            {
                sumUvArr[b + sumUvCursor] = uvAttArr[b];
            }
            sumUvCursor += uvAttArr.length;
            const groupArr = tempgeom.groups;
            for (let b = 0; b < groupArr.length; b++)
            {
                startGroupCount = lastGroupCount
                modelGeometry.addGroup(startGroupCount, groupArr[b].count, groupArr[b].materialIndex)
                lastGroupCount = startGroupCount + groupArr[b].count
            }
        }
        modelGeometry.setAttribute('position', new Float32BufferAttribute(sumPosArr, 3 ));
        sumNormArr.length && modelGeometry.setAttribute('normal', new Float32BufferAttribute(sumNormArr, 3 ));
        sumUvArr.length &&  modelGeometry.setAttribute('uv', new Float32BufferAttribute(sumUvArr, 2 ));
    
        return modelGeometry;
    }


    public mergeBufferGeometries( geometries:BufferGeometry[], useGroups:boolean = false ) {

        const isIndexed = geometries[ 0 ].index !== null;
    
        const attributesUsed = new Set( Object.keys( geometries[ 0 ].attributes ) );
        const morphAttributesUsed = new Set( Object.keys( geometries[ 0 ].morphAttributes ) );
    
        const attributes = {};
        const morphAttributes = {};
    
        const morphTargetsRelative = geometries[ 0 ].morphTargetsRelative;
    
        const mergedGeometry = new BufferGeometry();
    
        let offset = 0;
    
        for ( let i = 0; i < geometries.length; ++ i ) {
    
            const geometry = geometries[ i ];
            let attributesCount = 0;
    
            // ensure that all geometries are indexed, or none
    
            if ( isIndexed !== ( geometry.index !== null ) ) {
    
                console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.' );
                return null;
    
            }
    
            // gather attributes, exit early if they're different
    
            for ( const name in geometry.attributes ) {
    
                if ( ! attributesUsed.has( name ) ) {
    
                    console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.' );
                    return null;
    
                }
    
                if ( attributes[ name ] === undefined ) attributes[ name ] = [];
    
                attributes[ name ].push( geometry.attributes[ name ] );
    
                attributesCount ++;
    
            }
    
            // ensure geometries have the same number of attributes
    
            if ( attributesCount !== attributesUsed.size ) {
    
                console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.' );
                return null;
    
            }
    
            // gather morph attributes, exit early if they're different
    
            if ( morphTargetsRelative !== geometry.morphTargetsRelative ) {
    
                console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.' );
                return null;
    
            }
    
            for ( const name in geometry.morphAttributes ) {
    
                if ( ! morphAttributesUsed.has( name ) ) {
    
                    console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.' );
                    return null;
    
                }
    
                if ( morphAttributes[ name ] === undefined ) morphAttributes[ name ] = [];
    
                morphAttributes[ name ].push( geometry.morphAttributes[ name ] );
    
            }
    
            // gather .userData
    
            mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || [];
            mergedGeometry.userData.mergedUserData.push( geometry.userData );
    
            if ( useGroups ) {
    
                let count;
    
                if ( isIndexed ) {
    
                    count = geometry.index.count;
    
                } else if ( geometry.attributes.position !== undefined ) {
    
                    count = geometry.attributes.position.count;
    
                } else {
    
                    console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. The geometry must have either an index or a position attribute' );
                    return null;
    
                }
    
                mergedGeometry.addGroup( offset, count, i );
    
                offset += count;
    
            }
    
        }
    
        // merge indices
    
        if ( isIndexed ) {
    
            let indexOffset = 0;
            const mergedIndex = [];
    
            for ( let i = 0; i < geometries.length; ++ i ) {
    
                const index = geometries[ i ].index;
    
                for ( let j = 0; j < index.count; ++ j ) {
    
                    mergedIndex.push( index.getX( j ) + indexOffset );
    
                }
    
                indexOffset += geometries[ i ].attributes.position.count;
    
            }
    
            mergedGeometry.setIndex( mergedIndex );
    
        }
    
        // merge attributes
    
        for ( const name in attributes ) {
    
            const mergedAttribute = MeshControlUtils.single.mergeBufferAttributes( attributes[ name ] );
    
            if ( ! mergedAttribute ) {
    
                console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' attribute.' );
                return null;
    
            }
    
            mergedGeometry.setAttribute( name, mergedAttribute );
    
        }
    
        // merge morph attributes
    
        for ( const name in morphAttributes ) {
    
            const numMorphTargets = morphAttributes[ name ][ 0 ].length;
    
            if ( numMorphTargets === 0 ) break;
    
            mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
            mergedGeometry.morphAttributes[ name ] = [];
    
            for ( let i = 0; i < numMorphTargets; ++ i ) {
    
                const morphAttributesToMerge = [];
    
                for ( let j = 0; j < morphAttributes[ name ].length; ++ j ) {
    
                    morphAttributesToMerge.push( morphAttributes[ name ][ j ][ i ] );
    
                }
    
                const mergedMorphAttribute = MeshControlUtils.single.mergeBufferAttributes( morphAttributesToMerge );
    
                if ( ! mergedMorphAttribute ) {
    
                    console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' morphAttribute.' );
                    return null;
    
                }
    
                mergedGeometry.morphAttributes[ name ].push( mergedMorphAttribute );
    
            }
    
        }
    
        return mergedGeometry;
    
    }

    public mergeBufferAttributes( attributes:BufferAttribute[] ) {

        let TypedArray;
        let itemSize;
        let normalized;
        let arrayLength = 0;
    
        for ( let i = 0; i < attributes.length; ++ i ) {
    
            const attribute = attributes[ i ];
    
            // if ( attribute.isInterleavedBufferAttribute ) {
    
            //     console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.' );
            //     return null;
    
            // }
    
            if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
            if ( TypedArray !== attribute.array.constructor ) {
    
                console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.' );
                return null;
    
            }
    
            if ( itemSize === undefined ) itemSize = attribute.itemSize;
            if ( itemSize !== attribute.itemSize ) {
    
                console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.' );
                return null;
    
            }
    
            if ( normalized === undefined ) normalized = attribute.normalized;
            if ( normalized !== attribute.normalized ) {
    
                console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.' );
                return null;
    
            }
    
            arrayLength += attribute.array.length;
    
        }
    
        const array = new TypedArray( arrayLength );
        let offset = 0;
    
        for ( let i = 0; i < attributes.length; ++ i ) {
    
            array.set( attributes[ i ].array, offset );
    
            offset += attributes[ i ].array.length;
    
        }
    
        return new BufferAttribute( array, itemSize, normalized );
    
    }

    public getCutAngleMesh(cutMeshs:any[]):any[]{
        let i:number,j:number;
        let arr:BufferGeometry[] = [];
        let bgeometry:BufferGeometry = new BufferGeometry();
        let mesh:BIMAIMesh;
        let material = new MeshPhongMaterial({color:0x00ff00});
        let vecccc = new Vector3();
        let minx = Number.MAX_VALUE;
        let miny = Number.MAX_VALUE;
        let minz = Number.MAX_VALUE;
        let maxx = -9999;
        let maxy = -9999;
        let maxz = -9999;
        // bgeometry = MeshControlUtils.single.mergeBufferGeometry(cutMeshs);
        for(i=0;i<cutMeshs.length;i++){
            if(cutMeshs[i].position.x < minx){
                minx = cutMeshs[i].position.x;
            }
            if(cutMeshs[i].position.x > maxx){
                maxx = cutMeshs[i].position.x;
            }   
            if(cutMeshs[i].position.y < miny){
                miny = cutMeshs[i].position.y;
            }
            if(cutMeshs[i].position.y > maxy){
                maxy = cutMeshs[i].position.y;
            }
            if(cutMeshs[i].position.z < minz){
                minz = cutMeshs[i].position.z;
            }
            if(cutMeshs[i].position.z > maxz){
                maxz = cutMeshs[i].position.z;
            }  
        }
        for(i=0;i<cutMeshs.length;i++){
            let cloneG = cutMeshs[i].geometry.clone();
            cloneG.translate(cutMeshs[i].position.x,cutMeshs[i].position.y,cutMeshs[i].position.z);
            cloneG.translate(0,0,0);
            arr.push(cloneG);
        }
        bgeometry = MeshControlUtils.single.mergeBufferGeometries(arr,false);//THREE.BufferGeometryUtils.mergeBufferGeometries([bgeometry]);
        // bgeometry.translate(-(maxx-minx)/2,-(maxy-miny)/2,-(maxz-minz)/2);
        mesh = new BIMAIMesh(bgeometry,material,false);
        // let matrixWorldGeometry = bgeometry.clone().applyMatrix4(child.matrixWorld);
        // if(bgeometry){
        //     // ;
            // bgeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([bgeometry]);
        //     mesh = new Mesh(bgeometry,material);
        // }
        return [mesh];
    }

    public CalculateNormal(vertices:Vector3[], epsilon:number) {
        epsilon = epsilon || 0.0001;
        var i = 0;
        var a:Vector3;
        var b:Vector3;
        var ab:Vector3;
        var normal = null;
        var vsize = vertices.length;
        for (i = 0; i < vsize; i++) {
            a = vertices[(i - 1 + vsize) % vsize].clone();
            b = vertices[i].clone();
            ab = b.sub(a);
            if (ab.lengthSq() > 0)
                break;
        }
        while (i < vsize) {
            var c = vertices[i + 0].clone();
            var d = vertices[(i + 1) % vsize].clone();
            normal = ab.cross(d.sub(c));
            if (normal.lengthSq() > epsilon) {
                break;
            }
            i++;
        }
        if (normal == null) {
            return;
        }
        normal = normal.clone().normalize();
        return normal;
    }

    /**
     * 计算点组扩缩 
     */
    public pointExpand(vertices:Vector3[], normal:Vector3, value:number, isloop:boolean):Vector3[]{
        if (vertices.length < 3)
            return;
        var i:number;
        var copy = [];
        //isloop为false的时候，头尾两个点只计算平移，不计算缩小
        if (isloop) {
            copy.push(vertices[vertices.length - 1].clone());
        } else {
            copy.push((vertices[0].clone()).add((vertices[0].clone()).sub(vertices[1])));
        }
        for (i = 0; i < vertices.length; i++) {
            copy.push(vertices[i].clone());
        }
        if (isloop) {
            copy.push(vertices[0].clone());
        } else {
            copy.push((vertices[vertices.length - 1].clone()).add((vertices[vertices.length - 1].clone()).sub(vertices[vertices.length - 2])));
        }
        vertices.length = 0;
        for (i = 1; i < copy.length - 1; i++) {
            var a = copy[i - 1].clone();
            var b = copy[i + 0].clone();
            var c = copy[i + 1].clone();

            var p = ((b.clone()).sub(a).cross(normal)).clone().normalize();
            var q = ((c.clone()).sub(b).cross(normal)).clone().normalize();
            var n = ((p.clone()).add(q)).clone().normalize();

            var out = MeshControlUtils.single.mul(p, Math.abs(value));

            var cp = MeshControlUtils.single.rayCrossLine(b, n, (a.clone()).add(out), (b.clone()).add(out));

            if (cp != null) {
                var bevel = MeshControlUtils.single.sign(value) * cp.sub(b).length();

                vertices.push(b.add(MeshControlUtils.single.mul(n, bevel)));
            } else {
                vertices.push(b.add(MeshControlUtils.single.mul(out, value)));
            }
        }
        return vertices;
    }

    public sign(value:number):number{
        return value<0?-1:1;
    }

    public mul(a:Vector3, scale:number):Vector3{
        return new Vector3(a.x * scale, a.y * scale, a.z * scale);
    }

    public lerp(a:Vector3, b:Vector3, scale:number):Vector3{
        return MeshControlUtils.single.mul((b.clone()).sub(a), scale).add(a);
    }

    public isEqualVec3(v1:Vector3,v2:Vector3,epsilon:number=0.001):boolean{
        let bo = true;
        if(Math.abs(v1.x - v2.x) > epsilon || Math.abs(v1.y - v2.y) > epsilon || Math.abs(v1.z - v2.z) > epsilon){
            bo = false;
        }
        return bo;
    }

    /**
     * 计算三点形成得角度 p是交点
     */
    public CalcAngle(p:any,p1:any,p2:any,type:number=1):number{
        let dx1 = p1.x - p.x;
        let dx2 = p2.x - p.x;
        let dy1:number,dy2:number;
        if(type == 1){
            dy1 = p1.z - p.z;
            dy2 = p2.z - p.z;
        }else{
            dy1 = p1.y - p.y;
            dy2 = p2.y - p.y;
        }
        let c = Math.sqrt(dx1 * dx1 + dy1 * dy1) * Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (c == 0) return -1;
  
        let angle = Math.acos((dx1 * dx2 + dy1 * dy2) / c);
        // console.log('XXXXXX+'+angle+'YYYY+'+angle / Math.PI * 180);
        return angle / Math.PI * 180;
    }

    public rayCrossLine(pos:Vector3, dir:Vector3, p0:Vector3, p1:Vector3, epsilon:number=0.0001):Vector3{
        var nearzero = 0.00001;
        // epsilon = epsilon || 0.0001;
        var dir0 = dir;
        var dir1 = (p1.clone()).sub(p0);
        var up = ((dir0.clone()).cross(dir1)).clone().normalize();
        var diff = (pos.clone()).sub(p0);
        if (Math.abs(diff.dot(up)) > epsilon) return null;//异面
        var n1t = ((dir0.clone()).cross(up)).clone().normalize();
        var base = dir1.dot(n1t);
        if (Math.abs(base) < nearzero) return null;// 同面平衡
        var scale = diff.dot(n1t) / base;

        var r = MeshControlUtils.single.lerp(p0, p1, scale);

        var length1 = (r.clone()).sub(pos).dot(dir);

        if (length1 < -epsilon) return null; //负方向
        return r;
    }

    public addParameterEntity(v1:Vector2,v2:Vector2,v3:Vector2):void {

        let width = 1;
        // let v1= new Vector2(0.0, 0.0);
        // let v2= new Vector2(10.0, 0.0);
        // let v3= new Vector2(10.0, 10.0);

        let vv1 = v2.clone().sub(v1.clone());
        let vv2 = v3.clone().sub(v2.clone());
        console.log("向量：", vv1, vv2);

        let v1v = new Vector2(-vv1.y, vv1.x).normalize();
        let v2v = new Vector2(-vv2.y, vv2.x).normalize();
        console.log("垂直向量", v1v, v2v);

        let a1 = vv1.angle();
        let a2 = vv2.angle();
        console.log("角度：", a1, a2);

        let a3 = (Math.abs(a1)+ Math.abs(a2))/2;
        console.log("角度一半：", a3);
        let d = width/2;
        let r = d/Math.sin(a3);
        console.log("斜角长度：", r);

        let mv = vv1.rotateAround(v1, -a3);
        let nv = mv.normalize();
        console.log("v2旋转后的向量：", nv);

        console.log(v1, v2, v3)
        let s6 = new Vector2(d * v1v.x + v1.x, d * v1v.y + v1.y) ;
        let s1 = new Vector2(d * v1v.x * (-1) + v1.x, d * v1v.y * (-1) + v1.y);

        let s2 = new Vector2(r * nv.x + v2.x, r * nv.y + v2.y) ;
        let s5 = new Vector2(r * nv.x * (-1) + v2.x, r * nv.y * (-1) + v2.y);

        let s4 = new Vector2(d * v2v.x + v3.x, d * v2v.y + v3.y) ;
        let s3 = new Vector2(d * v2v.x * (-1) + v3.x, d * v2v.y * (-1) + v3.y);
       
        let mat = new LineBasicMaterial({
            color: 0xff0000
        })
        const points = [];
        points.push( new Vector3( s1.x, 0, s1.y ) );
        points.push( new Vector3( s2.x, 0, s2.y ) );
        points.push( new Vector3( s3.x, 0, s3.y ) );
        points.push( new Vector3( s4.x, 0, s4.y ) );
        points.push( new Vector3( s5.x, 0, s5.y ) );
        points.push( new Vector3( s6.x, 0, s6.y ) );


        console.log(points)

        let geo = new BufferGeometry().setFromPoints(points)

        let line = new Line(geo, mat);
        // this._scene.add(line);
        // 先算下共线的点
        let height = 10;
        let array = [
            // 底部
            s1.x, 0, s1.y, 
            s2.x, 0, s2.y,
            s3.x, 0, s3.y,
            s4.x, 0, s4.y,
            s5.x, 0, s5.y,
            s6.x, 0, s6.y, 
            // 顶部
            s1.x, height, s1.y, //6
            s2.x, height, s2.y,
            s3.x, height, s3.y,
            s4.x, height, s4.y,
            s5.x, height, s5.y,
            s6.x, height, s6.y,
        ]
         // 三角形顶点索引计算, 面为主，三角形渲染，与顺序无关
         var trianglesIndex = [
            1, 0, 7,
            0, 6, 7,

            5, 0, 11,
            0, 6, 11,


            3, 4, 9,
            4, 10, 9,

            2, 1, 8,
            1, 7, 8,

            2, 3, 8,
            3, 9, 8,

           

            4, 5, 10,
            5, 11, 10,

          
         ];

        
        this.createFace(array, trianglesIndex);
    }

    public createFace(array:number[], trianglesIndex:number[]):BIMAIMesh[] {
        // 三维坐标返回顶点索引  可以参照上面的五边形  返回结果是一样的
        var geometry = new BufferGeometry();
        //一个五边形多边形的顶点位置数据
        var vertices = new Float32Array(array);
        // 创建属性缓冲区对象
        var attribue = new BufferAttribute(vertices, 3); //3个为一组
        // 设置几何体attributes属性的位置position属性
        geometry.attributes.position = attribue;
        // Uint16Array类型数组创建顶点索引数据
        var indexes = new Uint16Array(trianglesIndex)
        // 索引数据赋值给几何体的index属性
        geometry.index = new BufferAttribute(indexes, 1); //1个为一组
          
         geometry.computeVertexNormals(); //不计算法线，表面比较暗，计算了比较亮，
         console.log(`查看几何体顶点数据`, geometry);
         //材质对象
         var material = new MeshLambertMaterial({
             color: 0xcccccc, //三角面颜色
             side: DoubleSide, //两面可见
             // 查看剖分的三角形效果
            //  wireframe:true,
         });
         var mesh = new BIMAIMesh(geometry, material); //网格模型对象Mesh
         return [mesh];     
    }



    public createCylinderByTwoPoints(pointX:Vector3,pointY:Vector3):BIMAIMesh{
        var direction = new Vector3().subVectors(pointY, pointX);
        var orientation = new Matrix4();
        orientation.lookAt(pointX, pointY, new Object3D().up);
        orientation.multiply(new Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));
        var edgeGeometry = new CylinderGeometry(2, 2, direction.length(), 8, 1);
        var material = new MeshLambertMaterial({
        color: 'orange'
        });
        var edge = new BIMAIMesh(edgeGeometry, material);
        edge.applyMatrix4(orientation);
        //两个点的中心点 position based on midpoints - there may be a better solution than this
        edge.position.x = (pointY.x + pointX.x) / 2;
        edge.position.y = (pointY.y + pointX.y) / 2;
        edge.position.z = (pointY.z + pointX.z) / 2;
        return edge;
    }

    public createCylinderByTwoPoints2(vstart:Vector3, vend:Vector3):BIMAIMesh{
        var HALF_PI = -Math.PI/4;
        var distance = vstart.distanceTo(vend);  //短一点的立方体
        var position = vend.clone().add(vstart).divideScalar(2);
        console.log("pos", position);

        var material = new MeshPhongMaterial({
        color: 0x0000ff
        });
        var cylinder = new CylinderGeometry(5, 5, distance, 4, 4, false);

        var orientation = new Matrix4(); //a new orientation matrix to offset pivot
        var offsetRotation = new Matrix4(); //a matrix to fix pivot rotation
        var offsetPosition = new Matrix4(); //a matrix to fix pivot position
        orientation.lookAt(vstart, vend, new Vector3(0, 1, 0)); //look at destination
        offsetRotation.makeRotationX(HALF_PI); //rotate 90 degs on X
        orientation.multiply(offsetRotation); //combine orientation with rotation transformations
        cylinder.applyMatrix4(orientation)

        var mesh = new BIMAIMesh(cylinder, material);
        mesh.position.set(position.x, position.y, position.z);
        return mesh;
    }

    public createShapeByTwoPoints2(vstart:Vector3, vend:Vector3,radius:number,ps:Vector2[]):BIMAIMesh{
        var radius = radius; // 管子的半径
        var wwww = 0;
        var hhhh = 0;
        var material = new MeshPhongMaterial({
            color: 0x00ff00
        });
        // if(ps && ps.length>1){
        //     hhhh = MeshControlUtils.single.toInt(Math.abs(ps[1].y-ps[0].y));
        // }else{
            hhhh = MeshControlUtils.single.toInt(Math.abs(vend.z-vstart.z));
        // }
        var geometry = new CylinderBufferGeometry(radius,radius,hhhh,64,1,false);
        var mesh = new BIMAIMesh( geometry, material );
        var miny = Math.min(vend.y,vstart.y)
        mesh.position.set(vstart.x,miny+hhhh/2,vstart.z);
        return mesh;
    }
    public createShapeByTwoPoints3(vstart:Vector3, vend:Vector3,w:number,h:number,ps:Vector2[]):BIMAIMesh{
        var radius = radius; // 管子的半径
        var wwww = w;
        var hhhh = h;
        var material = new MeshPhongMaterial({
            color: 0x00ff00
        });
        var llll = 0;
        // if(ps && ps.length>1){
        //     llll = MeshControlUtils.single.toInt(Math.abs(ps[1].y-ps[0].y));
        // }else{
            llll = MeshControlUtils.single.toInt(Math.abs(vend.z-vstart.z));
        // }
        var geometry = new BoxBufferGeometry(wwww,llll,hhhh);
        var mesh = new BIMAIMesh( geometry, material );
        var miny = Math.min(vend.y,vstart.y)
        mesh.position.set(vstart.x,miny+llll/2,vstart.z);
        return mesh;
    }

    public toInt(num:number) {
        return num*1 | 0 || 0;
    }

    public createShapeByTwoPoints(vstart:Vector3, vend:Vector3,w:number,h:number):BIMAIMesh{
        var radius = 2; // 管子的半径
        var wwww = w;
        var hhhh = h;
        // var orientation = new Matrix4();
        // orientation.lookAt(vstart, vend, new Object3D().up);
        // orientation.multiply(new Matrix4().set(1, 0, 0, 0,
        // 0, 0, 1, 0,
        // 0, -1, 0, 0,
        // 0, 0, 0, 1));
        var orignVec = new Vector2(vstart.x,vstart.z);
        var shape;
        // shape.absarc( 0, 0, radius, 0, Math.PI * 2, false );
        
        var material = new MeshPhongMaterial({color:0x00ff00});
        
        var v1 = new Vector3( vstart.x,  0, vstart.z);
        var v2 = new Vector3( vend.x,  0, vend.z);
        if(v1.z === v2.z){
            shape = new Shape([new Vector2(orignVec.y-hhhh,orignVec.x-wwww),new Vector2(orignVec.y-hhhh,orignVec.x+wwww),new Vector2(orignVec.y+hhhh,orignVec.x+wwww),new Vector2(orignVec.y+hhhh,orignVec.x-wwww)]);
        }else{
            shape = new Shape([new Vector2(orignVec.x-wwww,orignVec.y-hhhh),new Vector2(orignVec.x+wwww,orignVec.y-hhhh),new Vector2(orignVec.x+wwww,orignVec.y+hhhh),new Vector2(orignVec.x-wwww,orignVec.y+hhhh)]);
        }
        var path = new LineCurve3( v1, v2 )
        
        var extrudeSettings = {
            bevelEnabled: false,
            steps: 1,
            // depth:10,
            extrudePath: path
        };
        
        var geometry = new ExtrudeBufferGeometry( shape, extrudeSettings );
        geometry.userData.id = MeshControlconst.DRAW_MESH_NAME;
        geometry.userData.height = wwww;
        var mesh = new BIMAIMesh( geometry, material );
        // mesh.geometry.translate(0,wwww,0);
        // mesh.applyMatrix4(orientation);
        //两个点的中心点 position based on midpoints - there may be a better solution than this
        // mesh.position.x = (vend.x + vstart.x) / 2;
        // mesh.position.y = (vend.y + vstart.y) / 2;
        // mesh.position.z = (vend.z + vstart.z) / 2;
        mesh.position.set((vend.x + vstart.x) / 2,wwww,(vend.z + vstart.z) / 2);
        return mesh;
    }

    public getPointInBetweenByPerc(pointA:Vector3, pointB:Vector3, percentage:number):Vector3{
        var dir = pointB.clone().sub(pointA);
        var len = dir.length();
        dir = dir.normalize().multiplyScalar(len * percentage);
        return pointA.clone().add(dir);
    }

    public searchMeshs(arr:any[],obj:any):object{
        let bo = false;
        let id = -1;
        for(let i=0;i<arr.length;i++){
            if(obj === arr[i]){
                bo = true;
                id = i;
                break;
            }
        }
        return {bo:bo,id:id};
    }

    public getOriginalPointandPosition(arr:any[]):any[]{
        let xyz = MeshControlUtils.single.getPsLWbyPS(arr);
        for(let i=0;i<arr.length;i++){
            arr[i].x = arr[i].x - xyz[0];
            arr[i].y = arr[i].y - xyz[1];
        }
        return xyz;
    }

    public getPsLWbyPS(arr:any[]):number[]{
            let minx = Number.MAX_VALUE;
            let miny = Number.MAX_VALUE;
            let maxx = -9999;
            let maxy = -9999;
            let fn;
            for(let i=0;i<arr.length;i++){
                fn = arr[i];
                if(fn.x < minx){
                    minx = fn.x;
                }
                if(fn.x > maxx){
                    maxx = fn.x;
                }     
                if(fn.y < miny){
                    miny = fn.y;
                }
                if(fn.y > maxy){
                    maxy = fn.y;
                }
            }
            return [minx,miny,maxx,maxy,maxx-minx,maxy-miny];
    }

    public get3DCoordinateBy2D(p:Vector2):Vector3{
        let xy = new Vector3(( p.x / window.innerWidth ) * 2 - 1,- ( p.y / window.innerHeight ) * 2 + 1,0.5);
        return xy;
    }

    public IsEquals(a:number,b:number,tol:number=0.001){
        return Math.abs(a-b)<tol;
    }

    public getBIMAITypeMesh(arr:Vector3[],ps:Vector2[],type:number=0):BIMAIMesh{
        let mesh:BIMAIMesh;
        if(!arr || arr.length < 2)return mesh;
        switch(type){
            case MeshControlconst.DRAW_Mesh_WALL:
                mesh = MeshControlUtils.single.createShapeByTwoPoints(arr[0],arr[1],1,0.2);
                break;
            case MeshControlconst.DRAW_Mesh_CIRCLE:
                mesh = MeshControlUtils.single.createShapeByTwoPoints2(arr[0],arr[1],0.5,ps);
                break;
            case MeshControlconst.DRAW_Mesh_RECT:
                mesh = MeshControlUtils.single.createShapeByTwoPoints3(arr[0],arr[1],0.6,0.6,ps);
                break;
            case MeshControlconst.DRAW_Mesh_BEAM:
                mesh = MeshControlUtils.single.createShapeByTwoPoints(arr[0],arr[1],0.5,0.5);
                break;
            case MeshControlconst.DRAW_Mesh_BOARD:
                mesh = MeshControlUtils.single.createShapeByTwoPoints(arr[0],arr[1],1,0.2);
                break;
        }
        return mesh;
    }

    public getBIMAIMeshWidth(type:number=0):number{
        let wid = 0;
        switch(type){
            case MeshControlconst.DRAW_Mesh_WALL:
                wid = 0.2;
                break;
            case MeshControlconst.DRAW_Mesh_CIRCLE:
                wid = 0.5;
                break;
            case MeshControlconst.DRAW_Mesh_RECT:
                wid = 0.6;
                break;
            case MeshControlconst.DRAW_Mesh_BEAM:
                wid = 0.5;
                break;
            case MeshControlconst.DRAW_Mesh_BOARD:
                wid = 0.2;
                break;
        }
        return wid;
    }

    public addMesh(meshs:any[],mesh:any,scene:Scene):void{
        if(mesh && meshs){
            meshs.push(mesh);
            scene.add(mesh);
        }
    }

    public removeMesh(meshs:any[],mesh:any,scene:Scene):void{
        if(mesh && meshs){
            for(let i=meshs.length-1;i>-1;i--){
                if(meshs[i] === mesh){
                    meshs.splice(i,1);
                }
            }
            scene.remove(mesh);
        }
    }

    public noSelectWireFrame(arr:any[]):void{
        if(arr){
            for(let i=arr.length-1;i>-1;i--){
                if(arr[i].object && arr[i].object.name && (arr[i].object.name === MeshControlconst.WIRE_FRAME ||
                    arr[i].object.name === MeshControlconst.NOS_X_TRANSLATE || arr[i].object.name === MeshControlconst.NOS_Y_TRANSLATE
                    || arr[i].object.name === MeshControlconst.NOS_Z_TRANSLATE || arr[i].object.name === MeshControlconst.NOS_X_ROTATE 
                    || arr[i].object.name === MeshControlconst.NOS_Y_ROTATE || arr[i].object.name === MeshControlconst.NOS_Z_ROTATE)){
                    arr.splice(i,1);
                }
            }
        }
    }

    public getJsonOffset(arr:Vector2[],arr2:number[],arr3:number[]):void{
        for(let i=0;i<arr.length;i++){
            arr[i].x -= arr2[0];
            arr[i].y -= arr2[1];
        }
        if(arr3[0] > arr2[0]){
            arr3[0] = arr2[0];
        }
        if(arr3[2] > arr2[1]){
            arr3[2] = arr2[1];
        }
        if(arr3[1] < arr2[2]){
            arr3[1] = arr2[2];
        }
        if(arr3[3] < arr2[3]){
            arr3[3] = arr2[3];
        }
    }

    public getWireFrameByMesh(geometry:BufferGeometry):LineSegments{
        let edges = new EdgesGeometry( geometry );
        let line = new LineSegments( edges, new LineBasicMaterial( { color: 0x0000ff } ) );
        return line;
    }

    public getMeshCutAngle(mesh:BIMAIMesh):void{
        let vo = new Vector3();
        if(mesh){
            
        }
    }

    public getNameByType(num:number):string{
        let str:string;
        if(num > 0){
            switch(num){
                case 1:
                    str = MeshControlconst.WALL;
                    break;
                case 2:
                    str = MeshControlconst.CIRCLE_PILLAR;
                    break;
                case 3:
                    str = MeshControlconst.SQUARE_PILLAR;
                    break;
                case 4:
                    str = MeshControlconst.BEAM;
                    break;
                case 5:
                    str = MeshControlconst.FLOOR_BOARD;
                    break;
            }
        }
        return str;
    }
    public getWireFrameByArray(box:Box3,arr:any[]):Box3{
        let i:number,j:number;
        if(arr && arr.length > 0){
            if(!box){
                box = new Box3();
            }else{
                box.makeEmpty();
            }
            let group = new Group();
            for(i=0;i<arr.length;i++){
                group.add(arr[i].clone());
            }
            box.expandByObject(group);
        }
        return box;
    }

}