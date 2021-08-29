import { url } from 'inspector';
import {Provider} from './index'

class YoutubeProvider implements Provider {
    regex: RegExp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;
		
    canEmbed(url: string): boolean {
        const id = url.match(this.regex);
        return id !== null;
    };

    embed(url: string): HTMLElement {
        const id = url.match(this.regex);
        
        const embed = document.createElement("iframe");
		embed.setAttribute("width", "560")
		embed.setAttribute("height", "315")
		embed.setAttribute("allowfullscreen", "1")
		embed.setAttribute("frameborder", "0")
		embed.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
		embed.setAttribute("src", `https://www.youtube.com/embed/${id[1]}`)

		return embed;
    }

}

export default new YoutubeProvider();