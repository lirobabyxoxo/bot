const { SlashCommandBuilder } = require('discord.js');
const { getUser, updateBalance } = require('../economy_system.cjs');

module.exports = {
    name: 'pay',
    description: 'Transferir SayaCoins para outro usuário',
    aliases: ['pagar', 'transfer'],
    
    slashData: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Transferir SayaCoins para outro usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para receber as moedas')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantia')
                .setDescription('Quantidade de SayaCoins para transferir')
                .setRequired(true)
                .setMinValue(1)),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const targetUser = message.mentions.users.first();
        const amount = parseInt(args[1]);
        
        if (!targetUser) {
            const embed = createYakuzaEmbed(
                '❌ Erro',
                'Você precisa mencionar um usuário!\n\n**Uso:** `.pay @usuário <quantia>`',
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        if (!amount || amount <= 0 || isNaN(amount)) {
            const embed = createYakuzaEmbed(
                '❌ Erro',
                'Você precisa especificar uma quantia válida!\n\n**Uso:** `.pay @usuário <quantia>`',
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        if (targetUser.id === message.author.id) {
            const embed = createYakuzaEmbed(
                '❌ Erro',
                'Você não pode transferir moedas para si mesmo!',
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        if (targetUser.bot) {
            const embed = createYakuzaEmbed(
                '❌ Erro',
                'Você não pode transferir moedas para bots!',
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        const senderData = getUser(message.author.id);
        
        if (senderData.balance < amount) {
            const embed = createYakuzaEmbed(
                '❌ Saldo Insuficiente',
                `Você não tem moedas suficientes!\n\n` +
                `**Seu saldo:** \`${senderData.balance.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Tentou transferir:** \`${amount.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        updateBalance(message.author.id, -amount);
        updateBalance(targetUser.id, amount);
        
        const embed = createYakuzaEmbed(
            '💸 Transferência Realizada',
            `Você transferiu **${amount.toLocaleString('pt-BR')} SayaCoins** para ${targetUser}! 🪙\n\n` +
            `**Seu novo saldo:** \`${(senderData.balance - amount).toLocaleString('pt-BR')}\` 🪙`,
            colors.success
        );
        
        await message.reply({ embeds: [embed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const targetUser = interaction.options.getUser('usuario');
        const amount = interaction.options.getInteger('quantia');
        
        if (targetUser.id === interaction.user.id) {
            const embed = createYakuzaEmbed(
                '❌ Erro',
                'Você não pode transferir moedas para si mesmo!',
                colors.error
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        if (targetUser.bot) {
            const embed = createYakuzaEmbed(
                '❌ Erro',
                'Você não pode transferir moedas para bots!',
                colors.error
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const senderData = getUser(interaction.user.id);
        
        if (senderData.balance < amount) {
            const embed = createYakuzaEmbed(
                '❌ Saldo Insuficiente',
                `Você não tem moedas suficientes!\n\n` +
                `**Seu saldo:** \`${senderData.balance.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Tentou transferir:** \`${amount.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        updateBalance(interaction.user.id, -amount);
        updateBalance(targetUser.id, amount);
        
        const embed = createYakuzaEmbed(
            '💸 Transferência Realizada',
            `Você transferiu **${amount.toLocaleString('pt-BR')} SayaCoins** para ${targetUser}! 🪙\n\n` +
            `**Seu novo saldo:** \`${(senderData.balance - amount).toLocaleString('pt-BR')}\` 🪙`,
            colors.success
        );
        
        await interaction.reply({ embeds: [embed] });
    }
};
