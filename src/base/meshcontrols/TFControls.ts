import * as THREE from "three";
import { Camera, CylinderGeometry, EventDispatcher, LineBasicMaterial, Material, Matrix4, Mesh, MeshBasicMaterial, Object3D, Plane, Quaternion, Raycaster, Scene, Shape, ShapeGeometry, SphereGeometry, TorusGeometry, Vector2, Vector3 } from "three";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { BIMAIGroup } from "./BIMAIGroup";
import { BIMAIMesh } from "./BIMAIMesh";
import { MeshControlconst } from "./meshControlconst";
const _raycaster = new Raycaster();
const _plane = new Plane();
const _worldPosition = new Vector3();
const _intersection = new Vector3();
const gizmoMaterial = new MeshBasicMaterial( {
    depthTest: false,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    transparent: true,
    side:THREE.DoubleSide
} );

const gizmoLineMaterial = new LineBasicMaterial( {
    depthTest: false,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    transparent: true,
    side:THREE.DoubleSide
} );

// const lineGeometry2 = new CylinderGeometry( 0.5, 0.5, 30, 3 );
// lineGeometry2.translate( 0, 0.25, 0 );

const _unit = {
	X: new Vector3( 1, 0, 0 ),
	Y: new Vector3( 0, 1, 0 ),
	Z: new Vector3( 0, 0, 1 )
};
const mainScale:number = 0.05;

class TFControls extends Object3D{
    private scene:Scene; 
    private domElement:HTMLCanvasElement;
    private camera:Camera;
    private mesh:Object3D;
    private pointStart:Vector3 = new Vector3();
    private _positionStart:Vector3 = new Vector3();
    private _quaternionStart:Quaternion = new Quaternion();
	private _scaleStart:Vector3 = new Vector3();
    private worldPositionStart:Vector3 = new Vector3();
    private _intersections = [];
    private _offset = new Vector3();
    private _inverseMatrix:Matrix4 = new Matrix4();
    private gizmo = {};
	private picker = {};
	private helper = {};
    private moveType = 'XYZ';
    private _controlMode:number = 1;
    private _tempVector:Vector3 = new Vector3();
    private rotationAxis:Vector3 = new Vector3();
    private rotationAngle = 0;
    private eye:Vector3 = new Vector3();
    private _tempQuaternion = new Quaternion();
    private tempmoveVec:Vector3 = new Vector3();
    private controldrag:boolean = false;
    private _imgScale:number = 1;

    constructor(camera:Camera, domElement:HTMLCanvasElement,scene:Scene){
        super();
        // super(camera, domElement);
        this.scene = scene;
        this.domElement = domElement;
        this.camera = camera;
        this.name = 'TransformControls';

        let vertices = [
            0,0,0,
            0,0,5*mainScale,
            15*mainScale,0,0,

            0,0,5*mainScale,
            15*mainScale,0,5*mainScale,
            15*mainScale,0,0,

            20*mainScale,0,2.5*mainScale,
            15*mainScale,0,-3*mainScale,
            15*mainScale,0,8*mainScale,
        ];

        

        
        let tempvertices = new Float32Array(vertices);
        let arrowGeometry = new THREE.BufferGeometry();
        arrowGeometry.setAttribute( 'position', new THREE.BufferAttribute( tempvertices, 3 ) );
        const matRed = gizmoMaterial.clone();
		matRed.color.setHex( 0xff0000 );

        const matGray = gizmoMaterial.clone();
		matGray.color.setHex( 0x787878 );

        const matGreen = gizmoMaterial.clone();
		matGreen.color.setHex( 0x00ff00 );

		const matBlue = gizmoMaterial.clone();
		matBlue.color.setHex( 0x0000ff );

        const matInvisible = gizmoMaterial.clone();
        matInvisible.opacity = 0.15;

        const gizmoTranslate = {
			nos_X_translate: [
				[ new Mesh( arrowGeometry, matGreen ), [ 15*mainScale, 0, 0 ], [  0, 0, 0 ] ],
				// [ new Mesh( arrowGeometry, matRed ), [ - 0.5, 0, 0 ], [ 0, 0, Math.PI / 2 ]],
				// [ new Mesh( lineGeometry2, matRed ), [ 0, 0, 0 ], [ 0, 0, - Math.PI / 2 ]]
			],
			nos_Y_translate: [
				[ new Mesh( arrowGeometry, matRed ), [ 0, 15*mainScale, 0 ], [ 0, 0,  Math.PI / 2 ] ],
				// [ new Mesh( arrowGeometry, matGreen ), [ 0, - 0.5, 0 ], [ Math.PI, 0, 0 ]],
				// [ new Mesh( lineGeometry2, matGreen ) ]
			],
			nos_Z_translate: [
				// [ new Mesh( arrowGeometry, matBlue ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ]],
				[ new Mesh( arrowGeometry, matBlue ), [ 0, 0, 15*mainScale ], [  0, -Math.PI / 2, 0 ] ], 
				// [ new Mesh( lineGeometry2, matBlue ), null, [ Math.PI / 2, 0, 0 ]]
			],
		};
        const pickerTranslate = {
			nos_X_translate: [
				[ new Mesh( arrowGeometry, matInvisible ), [ 15*mainScale, 0, 0 ], [  0, 0, 0 ] ],
			],
			nos_Y_translate: [
				[ new Mesh( arrowGeometry, matInvisible ), [ 0, 15*mainScale, 0 ], [ 0, 0,  Math.PI / 2 ] ],
			],
			nos_Z_translate: [
				[ new Mesh( arrowGeometry, matInvisible ), [ 0, 0, 15*mainScale ], [  0, -Math.PI / 2, 0 ] ], 
			],
		};
        const gizmoRotate = {
			// XYZE: [
			// 	[ new Mesh( this.CircleGeometry( 20, 1 ), matGray ), null, [ 0, Math.PI / 2, 0 ]]
			// ],
			nos_X_rotate: [
				[ new Mesh( this.CircleGeometry( 35*mainScale, 1 ), matGreen ) ]
			],
			nos_Y_rotate: [
				[ new Mesh( this.CircleGeometry( 35*mainScale, 1 ), matRed ), null, [ 0, 0, - Math.PI / 2 ]]
			],
			nos_Z_rotate: [
				[ new Mesh( this.CircleGeometry( 35*mainScale, 1 ), matBlue ), null, [ 0, Math.PI / 2, 0 ]]
			],
		};
        const pickerRotate = {
			XYZE: [
				[ new Mesh( new SphereGeometry( 0.25, 10, 8 ), matInvisible ) ]
			],
			nos_X_rotate: [
				[ new Mesh( new TorusGeometry( 20, 0.1, 4, 24 ), matInvisible ), [ 0, 0, 0 ], [ 0, - Math.PI / 2, - Math.PI / 2 ]],
			],
			nos_Y_rotate: [
				[ new Mesh( new TorusGeometry( 20, 0.1, 4, 24 ), matInvisible ), [ 0, 0, 0 ], [ Math.PI / 2, 0, 0 ]],
			],
			nos_Z_rotate: [
				[ new Mesh( new TorusGeometry( 20, 0.1, 4, 24 ), matInvisible ), [ 0, 0, 0 ], [ 0, 0, - Math.PI / 2 ]],
			],
		};
        // let mesh1 = new Mesh( floorGeometry, matGreen );
        // let mesh2 = new Mesh( floorGeometry, matBlue );
        // let mesh3 = new Mesh( floorGeometry, matRed );
        // mesh2.rotation.set(0,-Math.PI / 2,0);
        // mesh3.rotation.set(0,0,Math.PI / 2);
        // mesh3.position.set(10,10,10);
        // let mesh2 = new Mesh( arrowGeometry2, matRed );
        // let mesh3 = new Mesh( arrowGeometry2, matBlue );
        // mesh3.position.set(0, 0, 0);
        // mesh3.rotation.set(0, Math.PI / 2, 0);
        // mesh3.position.set(0, 10, 0);
        // mesh1.position.set(0, 10, 0);
        // mesh1.rotation.set(Math.PI / 2, 0, 0);
        // const translateMousemove = function (event:any) {
        //     console.log('mousemove');
        // }

        // this.add(mesh1,mesh2,mesh3);
        // this.gizmo[ 'translate' ] = this.setupGizmo( gizmoTranslate );
		this.add( this.gizmo[ 'translate' ] = this.setupGizmo( gizmoTranslate ) );
        this.add( this.picker[ 'translate' ] = this.setupGizmo( pickerTranslate ) );
        this.add( this.gizmo[ 'rotate' ] = this.setupGizmo( gizmoRotate ) );
        this.add( this.picker[ 'rotate' ] = this.setupGizmo( pickerRotate ) );
        this.gizmo[ 'translate' ].visible = false;
        this.picker[ 'translate' ].visible = false;
        this.picker[ 'rotate' ].visible = false;
        this.gizmo[ 'rotate' ].visible = false;

        // let caaa = document.createElement('canvas');
        // caaa.width = 120;
        // caaa.height = 120;
        // let ctx = caaa.getContext('2d');
        // ctx.beginPath();
        // ctx.lineWidth = 3;
        // // ctx.fillStyle = "#0000ff";
        // ctx.strokeStyle = "#000000";
        // // ctx.arc(50,50,50,0,2*Math.PI);
        // ctx.moveTo(0, 0);
        // ctx.lineTo(15*mainScale, 0);
        // ctx.lineTo(15*mainScale, -3);
        // ctx.lineTo(20*mainScale, 2.5*mainScale);
        // ctx.lineTo(15*mainScale, 8*mainScale);
        // ctx.lineTo(15*mainScale, 5*mainScale);
        // ctx.lineTo(0, 5*mainScale);
        // ctx.lineTo(0, 0);
        // // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        // let texture = new THREE.CanvasTexture(caaa);
        // // texture.needsUpdate = true;
        // let material = new THREE.SpriteMaterial({map:texture,color:0x00ff00,sizeAttenuation:false});
        // var sprite = new THREE.Sprite( material );
        // sprite.scale.set(100,100,1);
        // this.add( sprite );
        // this.domElement.addEventListener( 'pointermove', this._onPointerHover );
        // this.gizmo[ 'translate' ].visible = false;
		// this.add( this.gizmo[ 'rotate' ] = this.setupGizmo( gizmoRotate ) );
		// this.add( this.gizmo[ 'scale' ] = this.setupGizmo( gizmoScale ) );
		// this.add( this.picker[ 'translate' ] = this.setupGizmo( pickerTranslate ) );
		// this.add( this.picker[ 'rotate' ] = this.setupGizmo( pickerRotate ) );
		// this.add( this.picker[ 'scale' ] = this.setupGizmo( pickerScale ) );
		// this.add( this.helper[ 'translate' ] = this.setupGizmo( helperTranslate ) );
		// this.add( this.helper[ 'rotate' ] = this.setupGizmo( helperRotate ) );
		// this.add( this.helper[ 'scale' ] = this.setupGizmo( helperScale ) );

        // const _gizmo = new TransformControlsGizmo();
		// this._gizmo = _gizmo;
		// this.add( _gizmo );

		// const _plane = new TransformControlsPlane();
		// this._plane = _plane;
		// this.add( _plane );
        // this.domElement.addEventListener( 'pointerdown', this.onPDown );
		// // this.domElement.addEventListener( 'pointermove', this.onPointerHover );
		// this.domElement.addEventListener( 'pointerup', this.onPUp );
    }

    updateMatrixWorld() {
        // this.camera.updateMatrixWorld();
		// this.camera.matrixWorld.decompose( this.cameraPosition, this.cameraQuaternion, this._cameraScale );
		this.eye.copy( this.camera.position ).sub( _worldPosition ).normalize();
        super.updateMatrixWorld( true );
    }
    
    private CircleGeometry( radius:number, arc:number ) {
        const geometry = new TorusGeometry( radius, 0.04, 3, 64, arc * Math.PI * 2 );
        geometry.rotateY( Math.PI / 2 );
        geometry.rotateX( Math.PI / 2 );
        return geometry;
    }

    private setupGizmo( gizmoMap ):Object3D {
        const gizmo = new Object3D();
        for ( const name in gizmoMap ) {
            for ( let i = gizmoMap[ name ].length; i --; ) {
                const object = gizmoMap[ name ][ i ][ 0 ].clone();
                const position = gizmoMap[ name ][ i ][ 1 ];
                const rotation = gizmoMap[ name ][ i ][ 2 ];
                const scale = gizmoMap[ name ][ i ][ 3 ];
                const tag = gizmoMap[ name ][ i ][ 4 ];
                // name and tag properties are essential for picking and updating logic.
                object.name = name;
                object.tag = tag;
                if ( position ) {
                    object.position.set( position[ 0 ], position[ 1 ], position[ 2 ] );
                }
                if ( rotation ) {
                    object.rotation.set( rotation[ 0 ], rotation[ 1 ], rotation[ 2 ] );
                }
                if ( scale ) {
                    object.scale.set( scale[ 0 ], scale[ 1 ], scale[ 2 ] );
                }
                object.updateMatrix();
                const tempGeometry = object.geometry.clone();
                tempGeometry.applyMatrix4( object.matrix );
                object.geometry = tempGeometry;
                object.renderOrder = Infinity;

                object.position.set( 0, 0, 0 );
                object.rotation.set( 0, 0, 0 );
                object.scale.set( 1, 1, 1 );
                gizmo.add( object );
            }
        }
        return gizmo;
    }

    public attach( object ) {
		this.mesh = object;
		this.visible = true;
        this.moveType = 'XYZ';
        console.log('type5_'+this.moveType);
		return this;
	}

    public detach() {
		this.mesh = undefined;
		this.visible = false;
		return this;
	}

    private intersectObjectWithRay( object, raycaster, includeInvisible ) {
        const allIntersections = raycaster.intersectObject( object, true );
        for ( let i = 0; i < allIntersections.length; i ++ ) {
            if ( allIntersections[ i ].object.visible || includeInvisible ) {
                return allIntersections[ i ];
            }
        }
        return false;
    }

    private pointerMove(pointer):void{
        if(!this.mesh)return;
        let _positionStart = new Vector3();
        let pointEnd = new Vector3();
        console.log('type3_'+this.moveType);
        _positionStart.copy( this.mesh.position );
        _raycaster.setFromCamera( pointer, this.camera );
        if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
            let subVec = _intersection.sub( this._offset );
            subVec = subVec.applyMatrix4( this._inverseMatrix);
            if(!this.gizmo[ 'rotate' ].visible && this.moveType === 'XYZ'){
                for(let i=0;i<this.gizmo[ 'translate' ].children.length;i++){
                    this.gizmo[ 'translate' ].children[i].visible = false;
                }
                subVec.y = this.mesh.position.y;
                this.mesh.position.copy( subVec );
                if(this.mesh instanceof BIMAIGroup){
                    this.mesh.WireFrame = true;
                }
            }else if(this.moveType.indexOf('translate') > -1){
                if(this.moveType === MeshControlconst.NOS_X_TRANSLATE){
                    subVec.y = this.mesh.position.y;
                    subVec.z = this.mesh.position.z;
                }else if(this.moveType === MeshControlconst.NOS_Y_TRANSLATE){
                    subVec.x = this.mesh.position.x;
                    subVec.z = this.mesh.position.z;
                }else if(this.moveType === MeshControlconst.NOS_Z_TRANSLATE){
                    subVec.x = this.mesh.position.x;
                    subVec.y = this.mesh.position.y;
                }
                for(let i=0;i<this.gizmo[ 'translate' ].children.length;i++){
                    this.gizmo[ 'translate' ].children[i].visible = false;
                    if(this.gizmo[ 'translate' ].children[i].name === this.moveType){
                        this.gizmo[ 'translate' ].children[i].visible = true;
                    }
                }
                this.updateGiMoPosition();
                // subVec.y = this.mesh.position.y;
                this.mesh.position.copy( subVec );
                if(this.mesh instanceof BIMAIGroup){
                    this.mesh.WireFrame = true;
                }
            }else if(this.gizmo[ 'rotate' ].visible && this.moveType.indexOf('rotate') > -1){
                console.log(this.tempmoveVec.x+'_'+this.tempmoveVec.y+'_'+this.tempmoveVec.z +'________'+subVec.x+'_'+subVec.y+'_'+subVec.z);
                this._offset.copy( subVec ).sub( _positionStart );
			    const ROTATION_SPEED = 20 / _worldPosition.distanceTo( this._tempVector.setFromMatrixPosition( this.camera.matrixWorld ) );
                if ( this.moveType === 'XYZE' ) {

                    this.rotationAxis.copy( this._offset ).cross( this.eye ).normalize();
                    this.rotationAngle = this._offset.dot( this._tempVector.copy( this.rotationAxis ).cross( this.eye ) ) * ROTATION_SPEED;
    
                } else if ( this.moveType === MeshControlconst.NOS_X_ROTATE || this.moveType === MeshControlconst.NOS_Y_ROTATE || this.moveType === MeshControlconst.NOS_Z_ROTATE ) {
                    let str = this.moveType.slice(4,5);
                    this.rotationAxis.copy( _unit[ str ] );
    
                    this._tempVector.copy( _unit[ str ] );
    
                    // if ( space === 'local' ) {
    
                    //     _tempVector.applyQuaternion( this.worldQuaternion );
    
                    // }
                    // if(this.mesh instanceof BIMAIMesh){
                    //     let obj = new Object3D();
                    //     let center = this.mesh.MeshCenter;
                    //     obj.add(this.mesh);
                        
                    //     this.scene.add(obj);
                    //     // this.mesh.position.set( center.x,center.y,center.z );
                    //     // this.mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation( -center.x,-center.y,-center.z ) );
                    // }
                    this.mesh.rotateOnAxis(_unit[ str ],5*Math.PI/180);
                    // if(this.mesh instanceof BIMAIGroup){
                    //     let vvvv2 = this.mesh.MeshCenter;
                    //     for(let i=0;i<this.mesh.children.length;i++){
                    //         let vvvvvvvv = vvvv2.sub(this.mesh.children[i].position);
                    //         let goZeroMatrix = new Matrix4().makeTranslation(-vvvv2.x, -vvvv2.y, -vvvv2.z);
                    //         this.mesh.children[i].matrix.premultiply(goZeroMatrix);
                    //     }
                    //     // console.log('world__'+vvvv2.x+'__'+vvvv2.y+'__'+vvvv2.z);
                    // }
                    
                    // this.rotationAngle = this._offset.dot( this._tempVector.cross( this.eye ).normalize() ) * ROTATION_SPEED;
                    // let ppppp = new Vector3();
                    // let ppp = this.mesh.getWorldPosition(this.mesh.position);
                    // if(this.mesh instanceof BIMAIGroup){
                    //     ppppp = this.mesh.MeshCenter;
                    //     // this.mesh.
                    // }
                    // ppppp = this.mesh.getWorldPosition(ppppp);
                    // let goZeroMatrix = new Matrix4().makeTranslation(ppppp.x, ppppp.y, ppppp.z);
                    // this.mesh.matrix.premultiply(goZeroMatrix);


                    // if(this.tempmoveVec.z > subVec.z){
                        // this.mesh.rotateOnAxis(_unit[ str ],-5*Math.PI/180);
                    // }else{
                        
                    // }
                }
                // if ( this.rotationSnap ) this.rotationAngle = Math.round( this.rotationAngle / this.rotationSnap ) * this.rotationSnap;

                // Apply rotate
                // if ( space === 'local' && axis !== 'E' && axis !== 'XYZE' ) {

                
                    // this.mesh.quaternion.copy( this._quaternionStart );
                    // this.mesh.quaternion.multiply( this._tempQuaternion.setFromAxisAngle( this.rotationAxis, this.rotationAngle ) ).normalize();

                // } else {

                //     this.rotationAxis.applyQuaternion( this._parentQuaternionInv );
                //     object.quaternion.copy( _tempQuaternion.setFromAxisAngle( this.rotationAxis, this.rotationAngle ) );
                //     object.quaternion.multiply( this._quaternionStart ).normalize();

                // }
            }
            
        }
    }

    set MoveType(str:string){
        this.moveType = str;
    }

    set ControlCamera(c:Camera){
        this.camera = c;
    }

    set imgScale(num:number){
        this._imgScale = num;
        // for(let i=0;i<){

        // }
    }

    set ControlMode(type:number){
        this._controlMode = type;
        if(this._controlMode === MeshControlconst.TRANSLATE_CONTROL_MODE){
            this.MoveType = 'XYZ';
        }
        this.changeControlMode();
    }
    get ControlMode():number{
        return this._controlMode;
    }

    public onControlPointerDown( event:any ) {
        // if ( ! this.enabled ) return;
        // this.domElement.setPointerCapture( event.pointerId );
        if(!this.mesh)return;
        let that = this;
        this._intersections.length = 0;
        let pointer = that.getPointer( event );
        _raycaster.setFromCamera( pointer, this.camera );
        _raycaster.intersectObjects( [this.mesh], true, this._intersections );
		const planeIntersect = this.intersectObjectWithRay( this.mesh, _raycaster, true );
		if ( this._intersections.length > 0 ) {
            // this._inverseMatrix.copy( this.mesh.parent.matrixWorld ).invert();
			// this.object.updateMatrixWorld();
			// this.object.parent.updateMatrixWorld();
			this._positionStart.copy( this.mesh.position );
			this._quaternionStart.copy( this.mesh.quaternion );
			this._scaleStart.copy( this.mesh.scale );
            _plane.setFromNormalAndCoplanarPoint( this.camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( this.mesh.matrixWorld ) );
            if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
                this._inverseMatrix.copy( this.mesh.parent.matrixWorld ).invert();
                this._offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( this.mesh.matrixWorld ) );
                this.tempmoveVec.copy(this._offset);
            }
			// this._quaternionStart.copy( this.object.quaternion );
			// this._scaleStart.copy( this.object.scale );
			// this.object.matrixWorld.decompose( this.worldPositionStart, this.worldQuaternionStart, this._worldScaleStart );
			this.pointStart.copy( planeIntersect.point ).sub( this.worldPositionStart );
            this.changeControlMode();
		}
        const onPointerMove = function (event:any) {
            // if ( ! this.enabled ) return;
            that.pointerMove( that.getPointer( event ) );
        }
        const onPointerUp = function (event:any) {
            that.controldrag = false;
            that.domElement.releasePointerCapture( event.pointerId );
            that.domElement.removeEventListener( 'pointermove', onPointerMove );
            that.domElement.removeEventListener( 'pointerup', onPointerUp );
            if(that.mesh){
                for(let i=0;i<that.gizmo[ 'translate' ].children.length;i++){
                    that.gizmo[ 'translate' ].children[i].visible = true;
                }
                that.changeControlMode();
            }
            that.dispatchEvent( { type: 'dragging' + '-changed', value: false } );
        }
        this.controldrag = true;
        this.domElement.addEventListener( 'pointermove', onPointerMove );
        this.domElement.addEventListener( 'pointerup', onPointerUp );
        this.dispatchEvent( { type: 'dragging' + '-changed', value: true } );
    }

    public onControlPointerMove( event:any ) {
        if(!this.mesh || !this.visible)return;
        if(!this.controldrag){
            this.moveType = 'XYZ';
            console.log('type2_'+this.moveType);
            let pp = this.getPointer( event );
            let xy = new Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1);
            _raycaster.setFromCamera( xy, this.camera );
            const intersects = _raycaster.intersectObject( this, true );
            if ( intersects.length > 0 ) {
                const selectedObject = intersects[ 0 ].object;
                if(selectedObject.name === MeshControlconst.NOS_X_TRANSLATE || selectedObject.name === MeshControlconst.NOS_Y_TRANSLATE
                    || selectedObject.name === MeshControlconst.NOS_Z_TRANSLATE || selectedObject.name === MeshControlconst.NOS_X_ROTATE 
                    || selectedObject.name === MeshControlconst.NOS_Y_ROTATE || selectedObject.name === MeshControlconst.NOS_Z_ROTATE){
                    this.MoveType = selectedObject.name;
                    // if()
                }
            }
        }
        
        let i:number,j:number,obj:Mesh;
        if(this.ControlMode === MeshControlconst.TRANSLATE_CONTROL_MODE){
            if(this.moveType === 'XYZ')return;
            for(i=0;i<this.gizmo[ 'translate' ].children.length;i++){
                obj = this.gizmo[ 'translate' ].children[i];
                (obj.material as MeshBasicMaterial).userData._color = (obj.material as MeshBasicMaterial).userData._color || (obj.material as MeshBasicMaterial).color.clone();
                (obj.material as MeshBasicMaterial).userData._opacity = (obj.material as MeshBasicMaterial).userData._opacity || (obj.material as MeshBasicMaterial).opacity;

                (obj.material as MeshBasicMaterial).color.copy( (obj.material as MeshBasicMaterial).userData._color );
                (obj.material as MeshBasicMaterial).opacity = (obj.material as MeshBasicMaterial).userData._opacity;
                if( this.moveType === obj.name ){
                    (obj.material as MeshBasicMaterial).color.setHex( 0xffff00 );
                    (obj.material as MeshBasicMaterial).opacity = 1.0;
                }
            }
        }else if(this.ControlMode === MeshControlconst.ROTATE_CONTROL_MODE){
            for(i=0;i<this.gizmo[ 'rotate' ].children.length;i++){
                obj = this.gizmo[ 'rotate' ].children[i];
                (obj.material as MeshBasicMaterial).userData._color = (obj.material as MeshBasicMaterial).userData._color || (obj.material as MeshBasicMaterial).color.clone();
                (obj.material as MeshBasicMaterial).userData._opacity = (obj.material as MeshBasicMaterial).userData._opacity || (obj.material as MeshBasicMaterial).opacity;

                (obj.material as MeshBasicMaterial).color.copy( (obj.material as MeshBasicMaterial).userData._color );
                (obj.material as MeshBasicMaterial).opacity = (obj.material as MeshBasicMaterial).userData._opacity;
                if( this.moveType === obj.name ){
                    (obj.material as MeshBasicMaterial).color.setHex( 0xffff00 );
                    (obj.material as MeshBasicMaterial).opacity = 1.0;
                }
            }
        }
    }

    public getDownTranControl(event:any):any{
        let xy = new Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1);
        let obj = null;
        _raycaster.setFromCamera( xy, this.camera );
        const intersects = _raycaster.intersectObject( this, true );
        if ( intersects.length > 0 ) {
            obj = intersects[ 0 ].object;
        }
        return obj;
    }

    private pointerHover(pointer) {
        // super['pointerHover'](pointer);
        // if(!this.axis){
        //     console.log('axis_'+'null');
        //     let raycaster = this.getRaycaster();
        //     raycaster.setFromCamera( pointer, this.camera );
		//     const intersect = super['intersectObjectWithRay']( super._gizmo.picker[ this.mode ], raycaster );super.
        // }
    }

    private updateGiMoPosition():void{
        let newVec:Vector3;
        if(this.mesh instanceof BIMAIMesh){
            newVec = this.mesh.MeshCenter;
            if(this._controlMode === MeshControlconst.TRANSLATE_CONTROL_MODE){
                this.gizmo[ 'translate' ].position.set(newVec.x,this.mesh.position.y,newVec.z);
            }else if(this._controlMode === MeshControlconst.ROTATE_CONTROL_MODE){
                this.gizmo[ 'rotate' ].position.set(newVec.x,this.mesh.position.y,newVec.z);
            }
        }else if(this.mesh instanceof BIMAIGroup){
            newVec = this.mesh.MeshCenter;
            if(this._controlMode === MeshControlconst.TRANSLATE_CONTROL_MODE){
                this.gizmo[ 'translate' ].position.set(newVec.x,this.mesh.position.y,newVec.z);
            }else if(this._controlMode === MeshControlconst.ROTATE_CONTROL_MODE){
                this.gizmo[ 'rotate' ].position.set(newVec.x,this.mesh.position.y,newVec.z);
            }
            
        } 
    }

    private changeControlMode():void{
        if(this.ControlMode === MeshControlconst.TRANSLATE_CONTROL_MODE){
            this.gizmo[ 'translate' ].visible = true;
            this.gizmo[ 'rotate' ].visible = false;
        }else if(this.ControlMode === MeshControlconst.ROTATE_CONTROL_MODE){
            this.gizmo[ 'rotate' ].visible = true;
            this.gizmo[ 'translate' ].visible = false;
        }
        this.updateGiMoPosition();
    }

    private getPointer( event ) {
        if ( this.domElement.ownerDocument.pointerLockElement ) {
            return {
                x: 0,
                y: 0,
                button: event.button
            };
        } else {
            const rect = this.domElement.getBoundingClientRect();
            return {
                x: ( event.clientX - rect.left ) / rect.width * 2 - 1,
                y: - ( event.clientY - rect.top ) / rect.height * 2 + 1,
                button: event.button
            };
        }
    }
    

    private _onPointerDown(event:any):void{
        event.preventDefault();
        super['onPointerDown'](event);
    }
}
export default TFControls;