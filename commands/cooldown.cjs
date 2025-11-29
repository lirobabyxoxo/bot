const { SlashCommandBuilder } = require('discord.js');
const { getUser, checkCooldown, formatTime } = require('../economy_system.cjs');

module.exports = {
    name: 'cooldown',
    description: 'Ver seus cooldowns ativos',
    aliases: ['cd'],
    
    slashData: new SlashCommandBuilder()
        .setName('cooldown')
        .setDescription('Ver seus cooldowns ativos'),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const userId = message.author.id;
        
        const dailyCooldown = checkCooldown(userId, 'daily');
        const workCooldown = checkCooldown(userId, 'work');
        
        let description = '**Atividades disponíveis:**\n\n';
        
        if (dailyCooldown.ready) {
            description += '🎁 **Daily:** ✅ Disponível agora!\n';
        } else {
            description += `🎁 **Daily:** ⏰ ${formatTime(dailyCooldown.timeLeft)}\n`;
        }
        
        if (workCooldown.ready) {
            description += '💼 **Work:** ✅ Disponível agora!\n';
        } else {
            description += `💼 **Work:** ⏰ ${formatTime(workCooldown.timeLeft)}\n`;
        }
        
        description += '\n**Jogos sempre disponíveis:**\n';
        description += '🪙 Coinflip\n';
        description += '🎲 Dados\n';
        description += '🎰 Cassino';
        
        const embed = createYakuzaEmbed(
            '⏰ Seus Cooldowns',
            description,
            colors.primary
        );
        
        await message.reply({ embeds: [embed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const userId = interaction.user.id;
        
        const dailyCooldown = checkCooldown(userId, 'daily');
        const workCooldown = checkCooldown(userId, 'work');
        
        let description = '**Atividades disponíveis:**\n\n';
        
        if (dailyCooldown.ready) {
            description += '🎁 **Daily:** ✅ Disponível agora!\n';
        } else {
            description += `🎁 **Daily:** ⏰ ${formatTime(dailyCooldown.timeLeft)}\n`;
        }
        
        if (workCooldown.ready) {
            description += '💼 **Work:** ✅ Disponível agora!\n';
        } else {
            description += `💼 **Work:** ⏰ ${formatTime(workCooldown.timeLeft)}\n`;
        }
        
        description += '\n**Jogos sempre disponíveis:**\n';
        description += '🪙 Coinflip\n';
        description += '🎲 Dados\n';
        description += '🎰 Cassino';
        
        const embed = createYakuzaEmbed(
            '⏰ Seus Cooldowns',
            description,
            colors.primary
        );
        
        await interaction.reply({ embeds: [embed] });
    }
};
