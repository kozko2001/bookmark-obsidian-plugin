import { Plugin, MarkdownPreviewRenderer, MarkdownPostProcessorContext, PluginSettingTab, App, Setting } from 'obsidian';

interface EmbedSettings {
	defaultEmbed: boolean;
}

const DEFAULT_SETTINGS: EmbedSettings = {
	defaultEmbed: true
}

export default class EmbedPlugin extends Plugin {
	settings: EmbedSettings;

	async onload() {
		await this.loadSettings();

		MarkdownPreviewRenderer.registerPostProcessor(this.markdownPostProcessor);

		this.addSettingTab(new EmbedSettingTab(this.app, this));

	}

	onunload() {
		MarkdownPreviewRenderer.unregisterPostProcessor(this.markdownPostProcessor);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	isActive(frontmatter: any | undefined): boolean {
		if(frontmatter === undefined) {
			return this.settings.defaultEmbed;
		}
		const override = frontmatter['forceEmbed'];
		if(override === undefined) {
			return this.settings.defaultEmbed;
		} else {
			return override === true;
		}
	}

	markdownPostProcessor = (
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
	): void => {
		const isActive = this.isActive(ctx.frontmatter);
		if(isActive) {
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


class EmbedSettingTab extends PluginSettingTab {
	plugin: EmbedPlugin;

	constructor(app: App, plugin: EmbedPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Embed links settings'});

		new Setting(containerEl)
			.setName('Embed default')
			.setDesc('Should embed links by default, you can enable/disable embed for specific notes using frontmatter')
			.addToggle(cb => cb
				.setValue(this.plugin.settings.defaultEmbed)
				.onChange(async value => {
					this.plugin.settings.defaultEmbed = value;
					await this.plugin.saveSettings();
				}));
	}
}