const { SlashCommandBuilder } = require('discord.js');
const { getUser } = require('../economy_system.cjs');

module.exports = {
    name: 'saldo',
    description: 'Verificar saldo de SayaCoins',
    aliases: ['balance', 'bal'],
    
    slashData: new SlashCommandBuilder()
        .setName('saldo')
        .setDescription('Verificar saldo de SayaCoins')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para verificar o saldo')
                .setRequired(false)),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const targetUser = message.mentions.users.first() || message.author;
        const userData = getUser(targetUser.id);
        
        const embed = createYakuzaEmbed(
            `💰 Saldo de ${targetUser.username}`,
            `**SayaCoins:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙\n\n` +
            `**Estatísticas:**\n` +
            `🎮 Jogos jogados: ${userData.stats.gamesPlayed}\n` +
            `✅ Vitórias: ${userData.stats.gamesWon}\n` +
            `❌ Derrotas: ${userData.stats.gamesLost}`,
            colors.primary
        );
        
        await message.reply({ embeds: [embed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const targetUser = interaction.options.getUser('usuario') || interaction.user;
        const userData = getUser(targetUser.id);
        
        const embed = createYakuzaEmbed(
            `💰 Saldo de ${targetUser.username}`,
            `**SayaCoins:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙\n\n` +
            `**Estatísticas:**\n` +
            `🎮 Jogos jogados: ${userData.stats.gamesPlayed}\n` +
            `✅ Vitórias: ${userData.stats.gamesWon}\n` +
            `❌ Derrotas: ${userData.stats.gamesLost}`,
            colors.primary
        );
        
        await interaction.reply({ embeds: [embed] });
    }
};
