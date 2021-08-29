import {Provider} from './index'

class TwitterProvider implements Provider {
    regex: RegExp = /twitter\.com\/.*\/status(?:es)?\/([^\/\?]+)/;
		
    canEmbed(url: string): boolean {
        return url.match(this.regex) !== null;
    };

    receiveMessage(event: any){
        const height = event.data.height;
        const id = event.data.element;
        document.getElementById(id).setAttribute("height", height)
    }

    generateUUID(): string {
        // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    embed(url: string): HTMLElement {
        window.addEventListener("message", this.receiveMessage, false);

        const embed = document.createElement("iframe");
        const id = this.generateUUID()
        embed.setAttribute("id", id)
		embed.setAttribute("width", "500")
		embed.setAttribute("height", "100")
		embed.setAttribute("border", "0")
		embed.setAttribute("frameborder", "0")
		embed.setAttribute("src", `https://twitframe.com/show?url=${encodeURI(url)}`)

        embed.onload = function() {
            this.contentWindow.postMessage({element: id, query: "height"}, "*")
        };
		return embed
    }

}

export default new TwitterProvider();