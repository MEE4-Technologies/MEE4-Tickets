const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const cooldowns = new Map();

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('open-ticket')
        .setDescription('Creates a new ticket channel')
        .addStringOption(option =>
            option.setName("name")
                .setDescription('The name of your ticket channel. MUST INCLUDE NEW')
                .setRequired(true))
        .setDMPermission(false),
    async execute(interaction) {
        if (cooldowns.has(interaction.user.id)) {
            const expirationTime = cooldowns.get(interaction.user.id) + 600000;
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                await interaction.reply({ content: `Wait another ${timeLeft.toFixed(1)} seconds before using the command again.`, ephemeral: true});
                return;
            }
        }

        cooldowns.set(interaction.user.id, Date.now());

        await interaction.reply({
            content: "I'm working on your request!", ephemeral: true
        });

        try {
            const channelName = interaction.options.getString('name');
            if (!channelName.toLowerCase().includes('new')) {
                await interaction.editReply({
                    content: 'The channel name must contain the word "new"!', ephemeral: true
                });
                return;
            }
            const channel = await interaction.guild.channels.create({
                name: `${channelName}-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.guild.roles.cache.get('1228395302709629120'),
                        allow: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            });
            
            await channel.send(`${interaction.user}. Your ticket has been created. \n Describe your issue and one of our <@&1228395302709629120> will be with you shortly.`);

            await interaction.editReply({
                content: `Ticket created! Channel with ticket: ${channelName}`,
            });
        } catch (error) {
            await interaction.editReply({
                content:
                    'Ticket was not created (check bot permissions)!', ephemeral: true
            });
            console.log(error)
        }
    },
};
