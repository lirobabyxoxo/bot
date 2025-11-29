const fs = require('fs');
const path = require('path');

const economyFile = path.join(__dirname, 'economy_data.json');

function loadEconomyData() {
    try {
        if (fs.existsSync(economyFile)) {
            const data = fs.readFileSync(economyFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar dados de economia:', error);
    }
    return {};
}

function saveEconomyData(data) {
    try {
        fs.writeFileSync(economyFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao salvar dados de economia:', error);
    }
}

function getUser(userId) {
    const data = loadEconomyData();
    if (!data[userId]) {
        data[userId] = {
            balance: 0,
            lastDaily: null,
            lastWork: null,
            stats: {
                gamesPlayed: 0,
                gamesWon: 0,
                gamesLost: 0,
                totalWinnings: 0,
                totalLosses: 0
            },
            inventory: []
        };
        saveEconomyData(data);
    }
    return data[userId];
}

function updateBalance(userId, amount) {
    const data = loadEconomyData();
    if (!data[userId]) {
        getUser(userId);
    }
    data[userId].balance += amount;
    saveEconomyData(data);
    return data[userId].balance;
}

function setBalance(userId, amount) {
    const data = loadEconomyData();
    if (!data[userId]) {
        getUser(userId);
    }
    data[userId].balance = amount;
    saveEconomyData(data);
    return data[userId].balance;
}

function checkCooldown(userId, type) {
    const user = getUser(userId);
    const now = Date.now();
    
    if (!user[`last${type.charAt(0).toUpperCase()}${type.slice(1)}`]) {
        return { ready: true };
    }
    
    const lastTime = user[`last${type.charAt(0).toUpperCase()}${type.slice(1)}`];
    const cooldowns = {
        daily: 24 * 60 * 60 * 1000, // 24 horas
        work: 5 * 60 * 1000 // 5 minutos
    };
    
    const timeLeft = (lastTime + cooldowns[type]) - now;
    
    if (timeLeft > 0) {
        return { ready: false, timeLeft };
    }
    
    return { ready: true };
}

function setCooldown(userId, type) {
    const data = loadEconomyData();
    if (!data[userId]) {
        getUser(userId);
    }
    data[userId][`last${type.charAt(0).toUpperCase()}${type.slice(1)}`] = Date.now();
    saveEconomyData(data);
}

function updateStats(userId, won, amount) {
    const data = loadEconomyData();
    if (!data[userId]) {
        getUser(userId);
    }
    
    data[userId].stats.gamesPlayed++;
    if (won) {
        data[userId].stats.gamesWon++;
        data[userId].stats.totalWinnings += amount;
    } else {
        data[userId].stats.gamesLost++;
        data[userId].stats.totalLosses += amount;
    }
    
    saveEconomyData(data);
}

function getAllUsers() {
    return loadEconomyData();
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

module.exports = {
    getUser,
    updateBalance,
    setBalance,
    checkCooldown,
    setCooldown,
    updateStats,
    getAllUsers,
    formatTime
};
