const { SlashCommandBuilder } = require('discord.js');
const { getUser, updateBalance, updateStats } = require('../economy_system.cjs');

const slotEmojis = ['🍒', '🍋', '🍊', '🍇', '🍉', '💎', '7️⃣'];

module.exports = {
    name: 'cassino',
    description: 'Jogar no cassino (slot machine)',
    aliases: ['slots', 'slot'],
    
    slashData: new SlashCommandBuilder()
        .setName('cassino')
        .setDescription('Jogar no cassino (slot machine)'),
    
    async execute(message, args, client, config, colors, createYakuzaEmbed, emojis) {
        const betAmount = 50; // Aposta fixa de 50
        const userData = getUser(message.author.id);
        
        if (userData.balance < betAmount) {
            const embed = createYakuzaEmbed(
                '❌ Saldo Insuficiente',
                `Você precisa de pelo menos **${betAmount} SayaCoins** para jogar no cassino!\n\n` +
                `**Seu saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            return message.reply({ embeds: [embed] });
        }
        
        const slot1 = slotEmojis[Math.floor(Math.random() * slotEmojis.length)];
        const slot2 = slotEmojis[Math.floor(Math.random() * slotEmojis.length)];
        const slot3 = slotEmojis[Math.floor(Math.random() * slotEmojis.length)];
        
        let winAmount = 0;
        let resultText = '';
        
        if (slot1 === '7️⃣' && slot2 === '7️⃣' && slot3 === '7️⃣') {
            winAmount = betAmount * 10;
            resultText = '🎰 **JACKPOT! TRIPLE 7!** 🎰';
        } else if (slot1 === '💎' && slot2 === '💎' && slot3 === '💎') {
            winAmount = betAmount * 5;
            resultText = '💎 **DIAMANTES! GRANDE PRÊMIO!** 💎';
        } else if (slot1 === slot2 && slot2 === slot3) {
            winAmount = betAmount * 3;
            resultText = '🎉 **TRÊS IGUAIS!** 🎉';
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            winAmount = betAmount;
            resultText = '✨ **DOIS IGUAIS!** (Dinheiro devolvido) ✨';
        } else {
            winAmount = 0;
            resultText = '😔 **Não foi desta vez...**';
        }
        
        const profit = winAmount - betAmount;
        
        if (profit > 0) {
            const newBalance = updateBalance(message.author.id, profit);
            updateStats(message.author.id, true, profit);
            
            const embed = createYakuzaEmbed(
                '🎰 Cassino - Vitória!',
                `🎰 [ ${slot1} | ${slot2} | ${slot3} ] 🎰\n\n` +
                `${resultText}\n\n` +
                `**Ganhou:** \`+${profit.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.success
            );
            await message.reply({ embeds: [embed] });
        } else if (profit === 0) {
            const embed = createYakuzaEmbed(
                '🎰 Cassino - Empate',
                `🎰 [ ${slot1} | ${slot2} | ${slot3} ] 🎰\n\n` +
                `${resultText}\n\n` +
                `**Saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙`,
                colors.warning
            );
            await message.reply({ embeds: [embed] });
        } else {
            const newBalance = updateBalance(message.author.id, -betAmount);
            updateStats(message.author.id, false, betAmount);
            
            const embed = createYakuzaEmbed(
                '🎰 Cassino - Derrota',
                `🎰 [ ${slot1} | ${slot2} | ${slot3} ] 🎰\n\n` +
                `${resultText}\n\n` +
                `**Perdeu:** \`-${betAmount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            await message.reply({ embeds: [embed] });
        }
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed, emojis) {
        const betAmount = 50; // Aposta fixa de 50
        const userData = getUser(interaction.user.id);
        
        if (userData.balance < betAmount) {
            const embed = createYakuzaEmbed(
                '❌ Saldo Insuficiente',
                `Você precisa de pelo menos **${betAmount} SayaCoins** para jogar no cassino!\n\n` +
                `**Seu saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const slot1 = slotEmojis[Math.floor(Math.random() * slotEmojis.length)];
        const slot2 = slotEmojis[Math.floor(Math.random() * slotEmojis.length)];
        const slot3 = slotEmojis[Math.floor(Math.random() * slotEmojis.length)];
        
        let winAmount = 0;
        let resultText = '';
        
        if (slot1 === '7️⃣' && slot2 === '7️⃣' && slot3 === '7️⃣') {
            winAmount = betAmount * 10;
            resultText = '🎰 **JACKPOT! TRIPLE 7!** 🎰';
        } else if (slot1 === '💎' && slot2 === '💎' && slot3 === '💎') {
            winAmount = betAmount * 5;
            resultText = '💎 **DIAMANTES! GRANDE PRÊMIO!** 💎';
        } else if (slot1 === slot2 && slot2 === slot3) {
            winAmount = betAmount * 3;
            resultText = '🎉 **TRÊS IGUAIS!** 🎉';
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            winAmount = betAmount;
            resultText = '✨ **DOIS IGUAIS!** (Dinheiro devolvido) ✨';
        } else {
            winAmount = 0;
            resultText = '😔 **Não foi desta vez...**';
        }
        
        const profit = winAmount - betAmount;
        
        if (profit > 0) {
            const newBalance = updateBalance(interaction.user.id, profit);
            updateStats(interaction.user.id, true, profit);
            
            const embed = createYakuzaEmbed(
                '🎰 Cassino - Vitória!',
                `🎰 [ ${slot1} | ${slot2} | ${slot3} ] 🎰\n\n` +
                `${resultText}\n\n` +
                `**Ganhou:** \`+${profit.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.success
            );
            await interaction.reply({ embeds: [embed] });
        } else if (profit === 0) {
            const embed = createYakuzaEmbed(
                '🎰 Cassino - Empate',
                `🎰 [ ${slot1} | ${slot2} | ${slot3} ] 🎰\n\n` +
                `${resultText}\n\n` +
                `**Saldo:** \`${userData.balance.toLocaleString('pt-BR')}\` 🪙`,
                colors.warning
            );
            await interaction.reply({ embeds: [embed] });
        } else {
            const newBalance = updateBalance(interaction.user.id, -betAmount);
            updateStats(interaction.user.id, false, betAmount);
            
            const embed = createYakuzaEmbed(
                '🎰 Cassino - Derrota',
                `🎰 [ ${slot1} | ${slot2} | ${slot3} ] 🎰\n\n` +
                `${resultText}\n\n` +
                `**Perdeu:** \`-${betAmount.toLocaleString('pt-BR')}\` 🪙\n` +
                `**Novo saldo:** \`${newBalance.toLocaleString('pt-BR')}\` 🪙`,
                colors.error
            );
            await interaction.reply({ embeds: [embed] });
        }
    }
};
