const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-ticket')
        .setDescription('Closes the current ticket')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Specify which ticket to close using its name.')
                .setRequired(true)),

    async execute(interaction) {
        const channelName = interaction.options.getString('name');

        await interaction.deferReply({ ephemeral: true });

        try {
            const channel = interaction.guild.channels.cache.find(ch => ch.name === channelName && ch.name.includes('new'));

            if (channel) {
                const everyoneRole = interaction.guild.roles.everyone;

                await channel.permissionOverwrites.set([
                    {
                        id: everyoneRole.id,
                        deny: [PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: interaction.guild.roles.cache.get('1228395302709629120'),
                        allow: [PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: everyoneRole.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ]
                );

                await interaction.editReply({
                    content: `Access to channel "${channelName}" has been successfully restricted!`,
                });
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
