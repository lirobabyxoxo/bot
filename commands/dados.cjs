const { SlashCommandBuilder } = require('discord.js');
const { getUser, updateBalance, updateStats } = require('../economy_system.cjs');

module.exports = {
    name: 'dados',
    description: 'Jogo de dados contra o bot',
    aliases: ['dice'],
    
    slashData: new SlashCommandBuilder()
        .setName('dados')
        .setDescription('Jogo de dados contra o bot')
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
                'Você precisa especificar uma quantia válida!\n\n**Uso:** `.dados <quantia>`',
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
        
        const playerDice1 = Math.floor(Math.random() * 6) + 1;
        const playerDice2 = Math.floor(Math.random() * 6) + 1;
        const playerTotal = playerDice1 + playerDice2;
        
        const botDice1 = Math.floor(Math.random() * 6) + 1;
        const botDice2 = Math.floor(Math.random() * 6) + 1;
        const botTotal = botDice1 + botDice2;
        
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        let resultText = '';
        let won = false;
        
        if (playerTotal > botTotal) {
            won = true;
            resultText = '🎉 **Você Ganhou!**';
        } else if (playerTotal < botTotal) {
            won = false;
            resultText = '😔 **Você Perdeu!**';
        } else {
            resultText = '🤝 **Empate!** (Dinheiro devolvido)';
        }
        
        if (playerTotal === botTotal) {
            const embed = createYakuzaEmbed(
                '🎲 Jogo de Dados - Empate',
                `🎲 **Seus dados:** ${diceEmojis[playerDice1-1]} ${diceEmojis[playerDice2-1]} = **${playerTotal}**\n` +
                `🤖 **Bot dados:** ${diceEmojis[botDice1-1]} ${diceEmojis[botDice2-1]} = **${botTotal}**\n\n` +
                `${resultText}\n\n` +
                `**Saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙`,
                colors.warning
            );
            await message.reply({ embeds: [embed] });
        } else if (won) {
            const newBalance = updateBalance(message.author.id, amount);
            updateStats(message.author.id, true, amount);
            
            const embed = createYakuzaEmbed(
                '🎲 Jogo de Dados - Vitória!',
                `🎲 **Seus dados:** ${diceEmojis[playerDice1-1]} ${diceEmojis[playerDice2-1]} = **${playerTotal}**\n` +
                `🤖 **Bot dados:** ${diceEmojis[botDice1-1]} ${diceEmojis[botDice2-1]} = **${botTotal}**\n\n` +
                `${resultText}\n\n` +
                `**Ganhou:** \`+${amount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.success
            );
            await message.reply({ embeds: [embed] });
        } else {
            const newBalance = updateBalance(message.author.id, -amount);
            updateStats(message.author.id, false, amount);
            
            const embed = createYakuzaEmbed(
                '🎲 Jogo de Dados - Derrota',
                `🎲 **Seus dados:** ${diceEmojis[playerDice1-1]} ${diceEmojis[playerDice2-1]} = **${playerTotal}**\n` +
                `🤖 **Bot dados:** ${diceEmojis[botDice1-1]} ${diceEmojis[botDice2-1]} = **${botTotal}**\n\n` +
                `${resultText}\n\n` +
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
        
        const playerDice1 = Math.floor(Math.random() * 6) + 1;
        const playerDice2 = Math.floor(Math.random() * 6) + 1;
        const playerTotal = playerDice1 + playerDice2;
        
        const botDice1 = Math.floor(Math.random() * 6) + 1;
        const botDice2 = Math.floor(Math.random() * 6) + 1;
        const botTotal = botDice1 + botDice2;
        
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        let resultText = '';
        let won = false;
        
        if (playerTotal > botTotal) {
            won = true;
            resultText = '🎉 **Você Ganhou!**';
        } else if (playerTotal < botTotal) {
            won = false;
            resultText = '😔 **Você Perdeu!**';
        } else {
            resultText = '🤝 **Empate!** (Dinheiro devolvido)';
        }
        
        if (playerTotal === botTotal) {
            const embed = createYakuzaEmbed(
                '🎲 Jogo de Dados - Empate',
                `🎲 **Seus dados:** ${diceEmojis[playerDice1-1]} ${diceEmojis[playerDice2-1]} = **${playerTotal}**\n` +
                `🤖 **Bot dados:** ${diceEmojis[botDice1-1]} ${diceEmojis[botDice2-1]} = **${botTotal}**\n\n` +
                `${resultText}\n\n` +
                `**Saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙`,
                colors.warning
            );
            await interaction.reply({ embeds: [embed] });
        } else if (won) {
            const newBalance = updateBalance(interaction.user.id, amount);
            updateStats(interaction.user.id, true, amount);
            
            const embed = createYakuzaEmbed(
                '🎲 Jogo de Dados - Vitória!',
                `🎲 **Seus dados:** ${diceEmojis[playerDice1-1]} ${diceEmojis[playerDice2-1]} = **${playerTotal}**\n` +
                `🤖 **Bot dados:** ${diceEmojis[botDice1-1]} ${diceEmojis[botDice2-1]} = **${botTotal}**\n\n` +
                `${resultText}\n\n` +
                `**Ganhou:** \`+${amount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.success
            );
            await interaction.reply({ embeds: [embed] });
        } else {
            const newBalance = updateBalance(interaction.user.id, -amount);
            updateStats(interaction.user.id, false, amount);
            
            const embed = createYakuzaEmbed(
                '🎲 Jogo de Dados - Derrota',
                `🎲 **Seus dados:** ${diceEmojis[playerDice1-1]} ${diceEmojis[playerDice2-1]} = **${playerTotal}**\n` +
                `🤖 **Bot dados:** ${diceEmojis[botDice1-1]} ${diceEmojis[botDice2-1]} = **${botTotal}**\n\n` +
                `${resultText}\n\n` +
                `**Perdeu:** \`-${amount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            await interaction.reply({ embeds: [embed] });
        }
    }
};
