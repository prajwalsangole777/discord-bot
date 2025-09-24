import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const bumpDataPath = path.join(__dirname, '../../../..', 'bumpData.json');

function loadBumpData(): Record<string, number> {
  if (!fs.existsSync(bumpDataPath)) return {};
  return JSON.parse(fs.readFileSync(bumpDataPath, 'utf-8'));
}

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Show the bump leaderboard');

export async function execute(interaction: ChatInputCommandInteraction) {
  const bumpData = loadBumpData();
  const sorted = Object.entries(bumpData).sort((a, b) => b[1] - a[1]);
  
  const userId = interaction.user.id;
  const userRank = sorted.findIndex(([id]) => id === userId) + 1;
  const userBumps = bumpData[userId] || 0;

  const top10 = sorted.slice(0, 10);
  const description = top10.map(([id, count], index) =>
    `**${index + 1}.** <@${id}> — ${count} bumps`
  ).join('\n');

  const embed = new EmbedBuilder()
    .setTitle('📊 Bump Leaderboard')
    .setDescription(description || 'No bumps yet!')
    .setColor(0x00AE86)
    .setFooter({ text: `Your rank: ${userRank || 'N/A'} (${userBumps} bumps)` });

  await interaction.reply({ embeds: [embed] });
}
