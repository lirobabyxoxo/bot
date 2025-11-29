const { SlashCommandBuilder } = require('discord.js');
const { getUser, getAllUsers } = require('../economy_system.cjs');

module.exports = {
    name: 'profile',
    description: 'Ver perfil de um jogador',
    aliases: ['perfil', 'p'],
    
    slashData: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Ver perfil de um jogador')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para ver o perfil')
                .setRequired(false)),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const targetUser = message.mentions.users.first() || message.author;
        const userData = getUser(targetUser.id);
        
        const allUsers = getAllUsers();
        const sortedUsers = Object.entries(allUsers)
            .sort((a, b) => b[1].balance - a[1].balance);
        
        const userRank = sortedUsers.findIndex(([id]) => id === targetUser.id) + 1;
        
        const winRate = userData.stats.gamesPlayed > 0 
            ? ((userData.stats.gamesWon / userData.stats.gamesPlayed) * 100).toFixed(1) 
            : '0.0';
        
        const netProfit = userData.stats.totalWinnings - userData.stats.totalLosses;
        
        let description = `**💰 Saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙\n`;
        description += `**📊 Ranking:** #${userRank}\n\n`;
        
        description += `**📈 Estatísticas de Jogos:**\n`;
        description += `🎮 Jogos jogados: ${userData.stats.gamesPlayed}\n`;
        description += `✅ Vitórias: ${userData.stats.gamesWon}\n`;
        description += `❌ Derrotas: ${userData.stats.gamesLost}\n`;
        description += `📊 Taxa de vitória: ${winRate}%\n\n`;
        
        description += `**💵 Ganhos totais:** \`${userData.stats.totalWinnings.toLocaleString('pt-BR')}\` 🪙\n`;
        description += `**💸 Perdas totais:** \`${userData.stats.totalLosses.toLocaleString('pt-BR')}\` 🪙\n`;
        description += `**📈 Lucro líquido:** \`${netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString('pt-BR')}\` 🪙\n\n`;
        
        description += `**🎒 Inventário:** ${userData.inventory.length === 0 ? 'Vazio' : userData.inventory.length + ' itens'}`;
        
        const embed = createYakuzaEmbed(
            `📋 Perfil de ${targetUser.username}`,
            description,
            colors.primary
        );
        
        embed.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
        
        await message.reply({ embeds: [embed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const targetUser = interaction.options.getUser('usuario') || interaction.user;
        const userData = getUser(targetUser.id);
        
        const allUsers = getAllUsers();
        const sortedUsers = Object.entries(allUsers)
            .sort((a, b) => b[1].balance - a[1].balance);
        
        const userRank = sortedUsers.findIndex(([id]) => id === targetUser.id) + 1;
        
        const winRate = userData.stats.gamesPlayed > 0 
            ? ((userData.stats.gamesWon / userData.stats.gamesPlayed) * 100).toFixed(1) 
            : '0.0';
        
        const netProfit = userData.stats.totalWinnings - userData.stats.totalLosses;
        
        let description = `**💰 Saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙\n`;
        description += `**📊 Ranking:** #${userRank}\n\n`;
        
        description += `**📈 Estatísticas de Jogos:**\n`;
        description += `🎮 Jogos jogados: ${userData.stats.gamesPlayed}\n`;
        description += `✅ Vitórias: ${userData.stats.gamesWon}\n`;
        description += `❌ Derrotas: ${userData.stats.gamesLost}\n`;
        description += `📊 Taxa de vitória: ${winRate}%\n\n`;
        
        description += `**💵 Ganhos totais:** \`${userData.stats.totalWinnings.toLocaleString('pt-BR')}\` 🪙\n`;
        description += `**💸 Perdas totais:** \`${userData.stats.totalLosses.toLocaleString('pt-BR')}\` 🪙\n`;
        description += `**📈 Lucro líquido:** \`${netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString('pt-BR')}\` 🪙\n\n`;
        
        description += `**🎒 Inventário:** ${userData.inventory.length === 0 ? 'Vazio' : userData.inventory.length + ' itens'}`;
        
        const embed = createYakuzaEmbed(
            `📋 Perfil de ${targetUser.username}`,
            description,
            colors.primary
        );
        
        embed.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
        
        await interaction.reply({ embeds: [embed] });
    }
};
