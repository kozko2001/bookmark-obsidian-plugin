import { url } from 'inspector';
import { Plugin, MarkdownPreviewRenderer, MarkdownPostProcessorContext, PluginSettingTab, App, Setting } from 'obsidian';
import Providers from './providers'
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

				const provider = Providers.filter(p => p.canEmbed(href)).first();

				if (provider) {
					const embed = provider.embed(href)
					if(embed) {
						link.parentElement.insertBefore(embed, link.nextSibling)
					}						
				}
			});
		}
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