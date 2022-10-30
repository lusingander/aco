export namespace main {
	
	export class Command {
	    cmd: string;
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new Command(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cmd = source["cmd"];
	        this.description = source["description"];
	    }
	}

}

