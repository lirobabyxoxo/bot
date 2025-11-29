const { SlashCommandBuilder } = require('discord.js');
const { getUser, updateBalance, checkCooldown, setCooldown, formatTime } = require('../economy_system.cjs');

module.exports = {
    name: 'daily',
    description: 'Recompensa diária de SayaCoins',
    
    slashData: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Recompensa diária de SayaCoins'),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const userId = message.author.id;
        const cooldown = checkCooldown(userId, 'daily');
        
        if (!cooldown.ready) {
            const embed = createYakuzaEmbed(
                '⏰ Cooldown Ativo',
                `Você já coletou sua recompensa diária!\n\n` +
                `**Tempo restante:** ${formatTime(cooldown.timeLeft)}`,
                colors.warning
            );
            return message.reply({ embeds: [embed] });
        }
        
        const reward = Math.floor(Math.random() * 401) + 100; // 100-500
        const newBalance = updateBalance(userId, reward);
        setCooldown(userId, 'daily');
        
        const embed = createYakuzaEmbed(
            '🎁 Recompensa Diária',
            `Você recebeu **${reward.toLocaleString('pt-BR')} SayaCoins**! 🪙\n\n` +
            `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙\n\n` +
            `Volte em 24 horas para coletar novamente!`,
            colors.success
        );
        
        await message.reply({ embeds: [embed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const userId = interaction.user.id;
        const cooldown = checkCooldown(userId, 'daily');
        
        if (!cooldown.ready) {
            const embed = createYakuzaEmbed(
                '⏰ Cooldown Ativo',
                `Você já coletou sua recompensa diária!\n\n` +
                `**Tempo restante:** ${formatTime(cooldown.timeLeft)}`,
                colors.warning
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const reward = Math.floor(Math.random() * 401) + 100; // 100-500
        const newBalance = updateBalance(userId, reward);
        setCooldown(userId, 'daily');
        
        const embed = createYakuzaEmbed(
            '🎁 Recompensa Diária',
            `Você recebeu **${reward.toLocaleString('pt-BR')} SayaCoins**! 🪙\n\n` +
            `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙\n\n` +
            `Volte em 24 horas para coletar novamente!`,
            colors.success
        );
        
        await interaction.reply({ embeds: [embed] });
    }
};
