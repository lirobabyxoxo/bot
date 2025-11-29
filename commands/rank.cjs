const { SlashCommandBuilder } = require('discord.js');
const { getAllUsers } = require('../economy_system.cjs');

module.exports = {
    name: 'rank',
    description: 'Ver ranking de SayaCoins',
    aliases: ['ranking', 'leaderboard', 'lb'],
    
    slashData: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Ver ranking de SayaCoins'),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const allUsers = getAllUsers();
        
        const sortedUsers = Object.entries(allUsers)
            .sort((a, b) => b[1].balance - a[1].balance)
            .slice(0, 10);
        
        if (sortedUsers.length === 0) {
            const embed = createYakuzaEmbed(
                '📊 Ranking de SayaCoins',
                'Nenhum usuário no ranking ainda!\n\nComece usando `.daily` ou `.work` para ganhar moedas!',
                colors.primary
            );
            return message.reply({ embeds: [embed] });
        }
        
        let description = '';
        const medals = ['🥇', '🥈', '🥉'];
        
        for (let i = 0; i < sortedUsers.length; i++) {
            const [userId, userData] = sortedUsers[i];
            
            try {
                const user = await client.users.fetch(userId);
                const medal = i < 3 ? medals[i] : `**${i + 1}.**`;
                const winRate = userData.stats.gamesPlayed > 0 
                    ? ((userData.stats.gamesWon / userData.stats.gamesPlayed) * 100).toFixed(1) 
                    : '0.0';
                
                description += `${medal} **${user.username}**\n`;
                description += `💰 \`${userData.balance.toLocaleString('pt-BR')}\` 🪙 | `;
                description += `🎮 ${userData.stats.gamesWon}/${userData.stats.gamesPlayed} (${winRate}%)\n\n`;
            } catch (error) {
                console.error('Erro ao buscar usuário no ranking:', error);
            }
        }
        
        const embed = createYakuzaEmbed(
            '📊 Ranking de SayaCoins',
            description,
            colors.primary
        );
        
        await message.reply({ embeds: [embed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const allUsers = getAllUsers();
        
        const sortedUsers = Object.entries(allUsers)
            .sort((a, b) => b[1].balance - a[1].balance)
            .slice(0, 10);
        
        if (sortedUsers.length === 0) {
            const embed = createYakuzaEmbed(
                '📊 Ranking de SayaCoins',
                'Nenhum usuário no ranking ainda!\n\nComece usando `/daily` ou `/work` para ganhar moedas!',
                colors.primary
            );
            return interaction.reply({ embeds: [embed] });
        }
        
        let description = '';
        const medals = ['🥇', '🥈', '🥉'];
        
        for (let i = 0; i < sortedUsers.length; i++) {
            const [userId, userData] = sortedUsers[i];
            
            try {
                const user = await client.users.fetch(userId);
                const medal = i < 3 ? medals[i] : `**${i + 1}.**`;
                const winRate = userData.stats.gamesPlayed > 0 
                    ? ((userData.stats.gamesWon / userData.stats.gamesPlayed) * 100).toFixed(1) 
                    : '0.0';
                
                description += `${medal} **${user.username}**\n`;
                description += `💰 \`${userData.balance.toLocaleString('pt-BR')}\` 🪙 | `;
                description += `🎮 ${userData.stats.gamesWon}/${userData.stats.gamesPlayed} (${winRate}%)\n\n`;
            } catch (error) {
                console.error('Erro ao buscar usuário no ranking:', error);
            }
        }
        
        const embed = createYakuzaEmbed(
            '📊 Ranking de SayaCoins',
            description,
            colors.primary
        );
        
        await interaction.reply({ embeds: [embed] });
    }
};
