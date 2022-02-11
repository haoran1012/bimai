export class StringUtil{
    static combindQuery(...args): string
    {
        let str: string = ""
        if(args)
        {
            for(let i: number = 0; i <args.length ;i++)
            {
                str += args[0] + "#";
            }
        }
       
        return str;
    }
}