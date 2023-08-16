import { ListenerBotApi, Record as WireRecord } from "@uesio/bots"
function addlead(bot: ListenerBotApi) {
	const fields = [
		"uesio/crm.title",
		"uesio/crm.firstname",
		"uesio/crm.lastname",
		"uesio/crm.account",
		"uesio/crm.no_employees",
		"uesio/crm.location",
		"uesio/crm.email",
		"uesio/crm.description",
		"uesio/crm.status",
	]
	const values = fields.reduce(
		(prev, key) => ({
			...prev,
			[key]: ((bot.params.get(key) as string) || "").toLowerCase(),
		}),
		{}
	) as Record<string, string>
	// TODO: callbots can't throw errors yet. Uncomment when they can
	const labels = {
		"uesio/crm.title": "Title",
		"uesio/crm.firstname": "First Name",
		"uesio/crm.lastname": "Last Name",
		"uesio/crm.account": "Company",
		"uesio/crm.no_employees": "No. Employees",
		"uesio/crm.location": "Country",
		"uesio/crm.email": "Email",
		"uesio/crm.description": "Description",
		"uesio/crm.status": "Status",
	} as Record<string, string>
	for (const key in values) {
		if (!values[key]) throw new Error(`missing ${labels[key]}`)
	}
	// Save the lead in our leads collection
	bot.asAdmin.save("uesio/crm.lead", [values as unknown as WireRecord])

	// Send an email to the user
	const salesEmail = bot.asAdmin.getConfigValue("uesio/crm.sales_email")
	const templateIdUser =
		bot.params.get("contact") === true
			? bot.asAdmin.getConfigValue(
					"uesio/web.email_templateid_contact_request"
			  )
			: bot.asAdmin.getConfigValue(
					"uesio/crm.email_template_lead_created_client"
			  )
	const templateIdSales =
		bot.params.get("contact") === true
			? bot.asAdmin.getConfigValue(
					"uesio/web.email_templateid_contact_request_internal"
			  )
			: bot.asAdmin.getConfigValue(
					"uesio/crm.email_template_lead_created_internal"
			  )

	// Email to user
	bot.asAdmin.runIntegrationAction("uesio/crm.sendgrid", "sendEmail", {
		to: [values["uesio/crm.email"]],
		from: salesEmail,
		templateId: templateIdUser,
		dynamicTemplateData: {
			firstname: values["uesio/crm.firstname"],
			lastname: values["uesio/crm.lastname"],
			email: values["uesio/crm.email"],
			company: values["uesio/crm.account"],
			title: values["uesio/crm.title"],
			location: values["uesio/crm.location"],
			descripton: values["uesio/crm.description"],
			noEmployees: values["uesio/crm.no_employees"],
		},
	})

	// Email to us
	bot.asAdmin.runIntegrationAction("uesio/crm.sendgrid", "sendEmail", {
		to: [salesEmail],
		from: salesEmail,
		templateId: templateIdSales,
		dynamicTemplateData: {
			firstname: values["uesio/crm.firstname"],
			lastname: values["uesio/crm.lastname"],
			email: values["uesio/crm.email"],
			company: values["uesio/crm.account"],
			title: values["uesio/crm.title"],
			location: values["uesio/crm.location"],
			descripton: values["uesio/crm.description"],
			noEmployees: values["uesio/crm.no_employees"],
		},
	})
}
