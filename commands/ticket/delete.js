const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-ticket')
        .setDescription('Delete the current ticket')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Specify which ticket to delete using its name.')
                .setRequired(true)),

    async execute(interaction) {
        const channelName = interaction.options.getString('name');

        await interaction.deferReply({ ephemeral: true });

        try {
            const channel = interaction.guild.channels.cache.find(ch => ch.name === channelName && ch.name.includes('new'));

            if (channel) {
                await interaction.editReply({
                    content: `Ticket ${channelName} has successfully been deleted.`,
                });
                await channel.delete();
            } else {
                await interaction.editReply({
                    content: `Channel "${channelName}" not found!`, ephemeral: true
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: 'An error occurred while changing channel access!', ephemeral: true
            });
        }
    },
};
