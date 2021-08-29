import { url } from 'inspector';
import {Provider} from './index'

class TwitterProvider implements Provider {
    regex: RegExp = /twitter\.com\/.*\/status(?:es)?\/([^\/\?]+)/;
		
    canEmbed(url: string): boolean {
        return url.match(this.regex) !== null;
    };

    embed(url: string): HTMLElement {
        const embed = document.createElement("iframe");
		embed.setAttribute("width", "250")
		embed.setAttribute("height", "550")
		embed.setAttribute("border", "0")
		embed.setAttribute("frameborder", "0")
		embed.setAttribute("src", `https://twitframe.com/show?url=${encodeURI(url)}`)

		return embed
    }

}

export default new TwitterProvider();