import { test, Oasys, Maintenance } from 'fixtures'
import { User } from 'classes/user'
import { testEnvironment } from 'localSettings'

const t2 = testEnvironment.name.includes('T2')

test('Create or update users', async ({ oasys, maintenance }) => {

    // NOTE: Admin user is handled by a separate script.

    for (const user of oasys.users.userList) {
        await createOrUpdateUser(user, oasys, maintenance)
    }

})

async function createOrUpdateUser(user: User, oasys: Oasys, maintenance: Maintenance) {

    if (user.profile) {
        await oasys.login(oasys.users.admin, user.profile.provider)
        await maintenance.userAccounts.goto()
        await maintenance.userAccounts.userName.setValue(user.username)
        await maintenance.userAccounts.search.click()
        const rows = await maintenance.userAccounts.userNameColumn.getCount()

        // Create or edit user account details
        if (rows == 0) {
            await maintenance.userAccounts.createAccount.click()
            await maintenance.maintainUser.userName.setValue(user.username)
        } else {
            await maintenance.userAccounts.userNameColumn.clickFirstRow()
        }
        await maintenance.maintainUser.surname.setValue(user.surname)
        await maintenance.maintainUser.forename1.setValue(user.forename1)
        await maintenance.maintainUser.emailAddress.setValue(`${user.username}@eor.${t2 ? 'localdomain' : 'local'}`)
        await maintenance.maintainUser.save.click()

        // New account goes to profile automatically.  Open profile if editing existing user.
        if (rows > 0) {
            await maintenance.maintainUser.close.click()
            await maintenance.userProfile.goto()
            await maintenance.userProfile.userName.setValue(user.username)
            await maintenance.userProfile.surname.setValue('')
            await maintenance.userProfile.forename1.setValue('')
            await maintenance.userProfile.search.click()
            await maintenance.userProfile.userNameColumn.clickFirstRow()
        }

        await maintenance.maintainFullUserProfile.lau.setValueByIndex(1)
        await maintenance.maintainFullUserProfile.mainTeam.setValueByIndex(1)
        if (user.profile.frameworkRole != null) {
            await maintenance.maintainFullUserProfile.frameworkRole.setValue(user.profile.frameworkRole)
        }
        await maintenance.maintainFullUserProfile.defaultCountersigner.setValue(user.profile.defaultCountersigner?.lovLookup ?? '%')

        if (user.profile.psrSigningLevel) {
            await maintenance.maintainFullUserProfile.psrSigningLevel.setValue(user.profile.psrSigningLevel)
        }

        await maintenance.maintainFullUserProfile.roles.clickButton('removeall')
        await maintenance.maintainFullUserProfile.roles.addItems(user.profile.roles)

        await maintenance.maintainFullUserProfile.save.click()
        await maintenance.maintainFullUserProfile.close.click()
        await oasys.logout()

    }

}
