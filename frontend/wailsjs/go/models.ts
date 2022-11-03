export namespace main {
	
	export class Command {
	    cmd: string;
	    pipeline: string[];
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new Command(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cmd = source["cmd"];
	        this.pipeline = source["pipeline"];
	        this.description = source["description"];
	    }
	}

}

