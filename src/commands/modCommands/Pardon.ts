import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { GuildMember } from 'discord.js'
import { injectable } from 'tsyringe'
import { ORM } from '../../persistence'
import { PermissionSuperUserOnly } from '../../guards/RoleChecks'

@Discord()
@injectable()
@PermissionSuperUserOnly
class Pardon {
  public constructor(private client: ORM) {}

  @SimpleCommand('pardon')
  async simplePardon(command: SimpleCommandMessage) {
    let mentionedMember: GuildMember | undefined
    if ((command.message.mentions.members?.size ?? 0) > 0) {
      mentionedMember = command.message.mentions.members?.first()
    }

    if (!mentionedMember) {
      return
    }

    await this.client.user
      .update({
        where: {
          id: mentionedMember.id,
        },
        data: {
          lastLoss: new Date(0),
          lastRandom: new Date(0),
        },
      })
      .then((_) =>
        command.message.channel.send(
          `${mentionedMember?.nickname ?? mentionedMember?.user.username}, consider your sentence served.`
        )
      )
  }
}