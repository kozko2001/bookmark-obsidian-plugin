import { Plugin, MarkdownPreviewRenderer } from 'obsidian';

export default class BoookmarkPlugin extends Plugin {

	async onload() {
		MarkdownPreviewRenderer.registerPostProcessor(this.markdownPostProcessor);
	}

	onunload() {
		MarkdownPreviewRenderer.unregisterPostProcessor(this.markdownPostProcessor);
	}

	markdownPostProcessor = (
		el: HTMLElement	
	): void => {
		el.querySelectorAll("a.external-link").forEach((link) => {
			const href = link.getAttribute("href");

			let embed = this.youtubeEmbed(href);
			if(embed) {
				link.parentElement.insertBefore(embed, link.nextSibling)
			}

			embed = this.twitterEmbed(href);
			if(embed) {
				link.parentElement.insertBefore(embed, link.nextSibling)
			}

		});
	}

	youtubeEmbed(url: string): HTMLElement {
		const regex = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/
		const id = url.match(regex)

		if(!id) {
			return;
		}
		
		const embed = document.createElement("iframe");
		embed.setAttribute("width", "560")
		embed.setAttribute("height", "315")
		embed.setAttribute("allowfullscreen", "1")
		embed.setAttribute("frameborder", "0")
		embed.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
		embed.setAttribute("src", `https://www.youtube.com/embed/${id[1]}`)

		return embed;
	}

	twitterEmbed(url: String): HTMLElement {
		const regex = /twitter\.com\/.*\/status(?:es)?\/([^\/\?]+)/
		const id = url.match(regex)

		if(!id) {
			return;
		}
		
		const embed = document.createElement("iframe");
		embed.setAttribute("width", "250")
		embed.setAttribute("height", "550")
		embed.setAttribute("border", "0")
		embed.setAttribute("frameborder", "0")
		embed.setAttribute("src", `https://twitframe.com/show?url=${encodeURI(url)}`)

		return embed
	}
}
