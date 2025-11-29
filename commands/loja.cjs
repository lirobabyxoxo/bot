const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'loja',
    description: 'Ver a loja de itens',
    aliases: ['shop', 'store'],
    
    slashData: new SlashCommandBuilder()
        .setName('loja')
        .setDescription('Ver a loja de itens'),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const embed = createYakuzaEmbed(
            '🏪 Loja de Itens',
            '**A loja está em construção!** 🚧\n\n' +
            'Em breve você poderá comprar:\n' +
            '• 🎨 Itens customizáveis\n' +
            '• 🛡️ Itens para RPG\n' +
            '• 🎁 Caixas misteriosas\n' +
            '• ⚡ Power-ups\n' +
            '• E muito mais!\n\n' +
            'Continue acumulando suas SayaCoins! 💰',
            colors.primary
        );
        
        await message.reply({ embeds: [embed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const embed = createYakuzaEmbed(
            '🏪 Loja de Itens',
            '**A loja está em construção!** 🚧\n\n' +
            'Em breve você poderá comprar:\n' +
            '• 🎨 Itens customizáveis\n' +
            '• 🛡️ Itens para RPG\n' +
            '• 🎁 Caixas misteriosas\n' +
            '• ⚡ Power-ups\n' +
            '• E muito mais!\n\n' +
            'Continue acumulando suas SayaCoins! 💰',
            colors.primary
        );
        
        await interaction.reply({ embeds: [embed] });
    }
};
