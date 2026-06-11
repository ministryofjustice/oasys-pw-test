import { test, User, Maintenance } from 'fixtures'
import { TestUser } from 'fixtures/user/testUsers'
import { testEnvironment } from 'localSettings'

const t2 = testEnvironment.name.includes('T2')

test('Create or update users', async ({ user, maintenance }) => {

    // NOTE: Admin user is handled by a separate script.

    for (const testUser of Object.values(user.prob)) {
        await createOrUpdateUser(testUser, user, maintenance)
    }
    for (const testUser of Object.values(user.pris)) {
        await createOrUpdateUser(testUser, user, maintenance)
    }

})

async function createOrUpdateUser(testUser: TestUser, user: User, maintenance: Maintenance) {

    if (testUser.profile) {
        await user.admin.login(testUser.profile.provider)
        await maintenance.userAccounts.goto()
        await maintenance.userAccounts.userName.setValue(testUser.username)
        await maintenance.userAccounts.search.click()
        const rows = await maintenance.userAccounts.userNameColumn.getCount()

        // Create or edit user account details
        if (rows == 0) {
            await maintenance.userAccounts.createAccount.click()
            await maintenance.maintainUser.userName.setValue(testUser.username)
        } else {
            await maintenance.userAccounts.userNameColumn.clickFirstRow()
        }
        await maintenance.maintainUser.surname.setValue(testUser.surname)
        await maintenance.maintainUser.forename1.setValue(testUser.forename1)
        await maintenance.maintainUser.emailAddress.setValue(`${testUser.username}@eor.${t2 ? 'localdomain' : 'local'}`)
        await maintenance.maintainUser.save.click()

        // New account goes to profile automatically.  Open profile if editing existing user.
        if (rows > 0) {
            await maintenance.maintainUser.close.click()
            await maintenance.userProfile.goto()
            await maintenance.userProfile.userName.setValue(testUser.username)
            await maintenance.userProfile.surname.setValue('')
            await maintenance.userProfile.forename1.setValue('')
            await maintenance.userProfile.search.click()
            await maintenance.userProfile.userNameColumn.clickFirstRow()
        }

        await maintenance.maintainFullUserProfile.lau.setValueByIndex(1)
        await maintenance.maintainFullUserProfile.mainTeam.setValueByIndex(1)
        if (testUser.profile.frameworkRole != null) {
            await maintenance.maintainFullUserProfile.frameworkRole.setValue(testUser.profile.frameworkRole)
        }
        await maintenance.maintainFullUserProfile.defaultCountersigner.setValue(testUser.profile.defaultCountersigner?.lovLookup ?? '%')

        if (testUser.profile.psrSigningLevel) {
            await maintenance.maintainFullUserProfile.psrSigningLevel.setValue(testUser.profile.psrSigningLevel)
        }

        await maintenance.maintainFullUserProfile.roles.clickButton('removeall')
        await maintenance.maintainFullUserProfile.roles.addItems(testUser.profile.roles)

        await maintenance.maintainFullUserProfile.save.click()
        await maintenance.maintainFullUserProfile.close.click()
        await user.logout()

    }

}
