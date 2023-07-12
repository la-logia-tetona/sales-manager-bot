const Clock = require("../helpers/Clock");

class AccessManager {
    static async canAccess(thread, messageId, interaction) {
        const firstAccessLogMessage = await AccessManager.findById(thread, messageId);
        if (firstAccessLogMessage === null) return true; //An error dont restrict access
    
        const accessTryTimestamp = Clock.nowMoment();
        //From
        //Access Log:
        //[2023-04-14 20:20:07] @​Gianluca
        //[2023-04-14 20:26:57] @Gianluca
        //To
        //creationDate=2023-04-14
        //creationTime=20:20:07
        const [creationDate, creationTime] = (((firstAccessLogMessage.content.split("\r\n")[1])
        .split('[')[1])
        .split(']')[0])
        .split(' ');
        const creationTimestamp = Clock.from(Date.parse(creationDate+"T"+creationTime));

        console.log("threadName", thread.name);
        console.log("creationDateAndTime", creationDate+"T"+creationTime);
        console.log("creationTimestamp", creationTimestamp);
        console.log("accessTryTimestamp", accessTryTimestamp);

        return AccessManager.canAccessByRole(interaction, creationTimestamp, accessTryTimestamp)
    }

    static async findById(thread, messageId) {
        return await thread.messages.fetch(messageId, {
            cache: false,
            force: true,
        });
    }

    static async canAccessByRole(interaction, creationTimestamp, accessTryTimestamp) {
		const memberRoles = interaction.member.roles.cache;
        const minutesSinceCreation = Clock.diffInMinutes(creationTimestamp, accessTryTimestamp);
        // Admin
        if (memberRoles.has('874980340475764769')) { return this.canAccessByDelay(minutesSinceCreation, 0); }
        // Legendario
        if (memberRoles.has('877557532732846140')) { return this.canAccessByDelay(minutesSinceCreation, 0); }
        // Gran Maestro
        if (memberRoles.has('879120563862388757')) { return this.canAccessByDelay(minutesSinceCreation, 0); }
        // Maestro
        if (memberRoles.has('879120465581465650')) { return this.canAccessByDelay(minutesSinceCreation, 0); }
        // Avanzado
        if (memberRoles.has('879119405072654338')) { return this.canAccessByDelay(minutesSinceCreation, 10); }
        // Confirmado
        //if (memberRoles.has('946948146498502716')) { return this.canAccessByDelay(minutesSinceCreation, 2); }
        //this.canAccessByDelay(saleAccessInfo, 12000);
		return -1;
	}

	static canAccessByDelay(minutesSinceCreation, roleDelay) {
		return minutesSinceCreation > roleDelay ? 0 : (roleDelay - minutesSinceCreation);
	}
}

module.exports = AccessManager;
