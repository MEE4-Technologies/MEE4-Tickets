const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("claim")
    .setDescription("Claim a ticket")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option.setName("ticket").setDescription("The ticket to claim").setRequired(true)
    ),
  async execute(interaction) {
    const ticket = interaction.options.getString("ticket");
    const channel = interaction.guild.channels.cache.find(ch => ch.name === ticket && ch.name.includes('new'));
    
    try {
        if (channel) {
            interaction.channel.send({
                content: `${interaction.user} will be solving your ticket. If you have any issues, then please use **/report**.`
            })
        } else {
            interaction.reply({
                content: `There is no ticket with the name ${ticket}.`,
                ephemeral: true,
            })
        }
    } catch (error) {
        console.log(error);
    }
  },
};
