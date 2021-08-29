import YoutubeProvider from "./youtube"
import TwitterProvider from "./twitter"


export interface Provider {
    canEmbed(url: string): boolean;
    embed(url: string): HTMLElement;
}

export default [YoutubeProvider, TwitterProvider]