
/* Entity for MUser */

$data.Entity.extend("data.AppUser", {
	AppUserToAppRole: {
		type: Array, elementType: "data.AppRole", inverseProperty: "AppRoleToAppUser"
	},
	oid: {
		type: "integer", key: true, computed: true
	},
	username: {
		type: "string"
	}
});

/* Entity for MRole */

$data.Entity.extend("data.AppRole", {
	AppRoleToAppUser: {
		type: "data.AppUser", inverseProperty: "AppUserToAppRole"
	},
	AppRoleToAppUser__oid: {
		type: "integer", enumerable: false
	},
	oid: {
		type: "integer", key: true, computed: true
	},
	name: {
		type: "string"
	}
});

/* Entity for cls8 */

$data.Entity.extend("data.Question", {
	oid: {
		type: "integer", key: true, computed: true
	},
	explanation: {
		type: "string"
	},
	language: {
		type: "string"
	},
	content: {
		type: "string"
	},
	questionId: {
		type: "integer"
	}
});

/* Entity for cls9 */

$data.Entity.extend("data.Answer", {
	oid: {
		type: "integer", key: true, computed: true
	},
	questionId: {
		type: "integer"
	},
	correctness: {
		type: "boolean"
	},
	content: {
		type: "string"
	}
});

/* Entity for cls1 */

$data.Entity.extend("data.Status", {
	oid: {
		type: "integer", key: true, computed: true
	},
	questionId: {
		type: "integer"
	},
	level: {
		type: "integer"
	}
});

/* Entity Context */

$data.EntityContext.extend("ManagementContext", {
	data_AppUserSet: {
		type: $data.EntitySet, elementType: data.AppUser
	},
	data_AppRoleSet: {
		type: $data.EntitySet, elementType: data.AppRole
	},
	data_QuestionSet: {
		type: $data.EntitySet, elementType: data.Question
	},
	data_AnswerSet: {
		type: $data.EntitySet, elementType: data.Answer
	},
	data_StatusSet: {
		type: $data.EntitySet, elementType: data.Status
	}
});
