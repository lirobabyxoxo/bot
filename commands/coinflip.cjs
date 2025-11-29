const { SlashCommandBuilder } = require('discord.js');
const { getUser, updateBalance, updateStats } = require('../economy_system.cjs');

module.exports = {
    name: 'coinflip',
    description: 'Apostar em cara ou coroa',
    aliases: ['cf', 'flip', 'moeda'],
    
    slashData: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Apostar em cara ou coroa')
        .addIntegerOption(option =>
            option.setName('quantia')
                .setDescription('Quantidade de SayaCoins para apostar')
                .setRequired(true)
                .setMinValue(1)),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const amount = parseInt(args[0]);
        
        if (!amount || amount <= 0 || isNaN(amount)) {
            const embed = createYakuzaEmbed(
                '❌ Erro',
                'Você precisa especificar uma quantia válida!\n\n**Uso:** `.coinflip <quantia>`',
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        const userData = getUser(message.author.id);
        
        if (userData.balance < amount) {
            const embed = createYakuzaEmbed(
                '❌ Saldo Insuficiente',
                `Você não tem moedas suficientes!\n\n` +
                `**Seu saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Tentou apostar:** \`${amount.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        const won = Math.random() < 0.5;
        const result = won ? 'Cara' : 'Coroa';
        const emoji = won ? '🪙' : '👑';
        
        if (won) {
            const newBalance = updateBalance(message.author.id, amount);
            updateStats(message.author.id, true, amount);
            
            const embed = createYakuzaEmbed(
                `${emoji} Coinflip - Vitória!`,
                `🎉 A moeda caiu em **${result}**! Você ganhou!\n\n` +
                `**Ganhou:** \`+${amount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.success
            );
            await message.reply({ embeds: [embed] });
        } else {
            const newBalance = updateBalance(message.author.id, -amount);
            updateStats(message.author.id, false, amount);
            
            const embed = createYakuzaEmbed(
                `${emoji} Coinflip - Derrota`,
                `😔 A moeda caiu em **${result}**! Você perdeu!\n\n` +
                `**Perdeu:** \`-${amount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            await message.reply({ embeds: [embed] });
        }
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const amount = interaction.options.getInteger('quantia');
        const userData = getUser(interaction.user.id);
        
        if (userData.balance < amount) {
            const embed = createYakuzaEmbed(
                '❌ Saldo Insuficiente',
                `Você não tem moedas suficientes!\n\n` +
                `**Seu saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Tentou apostar:** \`${amount.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const won = Math.random() < 0.5;
        const result = won ? 'Cara' : 'Coroa';
        const emoji = won ? '🪙' : '👑';
        
        if (won) {
            const newBalance = updateBalance(interaction.user.id, amount);
            updateStats(interaction.user.id, true, amount);
            
            const embed = createYakuzaEmbed(
                `${emoji} Coinflip - Vitória!`,
                `🎉 A moeda caiu em **${result}**! Você ganhou!\n\n` +
                `**Ganhou:** \`+${amount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.success
            );
            await interaction.reply({ embeds: [embed] });
        } else {
            const newBalance = updateBalance(interaction.user.id, -amount);
            updateStats(interaction.user.id, false, amount);
            
            const embed = createYakuzaEmbed(
                `${emoji} Coinflip - Derrota`,
                `😔 A moeda caiu em **${result}**! Você perdeu!\n\n` +
                `**Perdeu:** \`-${amount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            await interaction.reply({ embeds: [embed] });
        }
    }
};
