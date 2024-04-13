const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Bot Issue? Report it!')
        .addStringOption(option =>
            option.setName('issue')
                .setDescription('What is the issue?')
                .setRequired(true)
        ),
    async execute(interaction) {
        const issue = interaction.options.getString('issue');
        const channelId = '1228799166805971094';

        const channel = await interaction.client.channels.fetch(channelId);
        
        if (channel) {
            const reportEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle('New Issue Report')
                .setDescription(`${interaction.user} has reported: \n \`\`\`${issue}\`\`\``)
                .setColor("DarkBlue")
                .setTimestamp()
                .setFooter({ text: 'MEE4 Tickets Report System' });
            channel.send({ embeds: [reportEmbed]});
            await interaction.reply({
                content: "Your issue has been sent to our developers. We will review it shortly. \n Thank you for reporting about the issue.",
                ephemeral: true
            });
        } else {
            console.error(`Channel with ID ${channelId} not found.`);
        }
    }
}