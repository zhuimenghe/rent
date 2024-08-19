export default (info) => {
	let machine = info;
	return {
		address: machine.address || null,
		licenseId: machine.licenseId || null,
		machineBrand: machine.machineBrand || null,
		machineHeight: machine.machineHeight || null,
		machineHeightName: machine.machineHeightDesc || null,
		machineId: machine.id || null,
		machineTypeId: machine.machineTypeId || null,
		machineTypeName: machine.machineTypeName || null,
		orgId: machine.orgId || null,
		orgName: machine.orgName || null,
		printCode: machine.printCode || null,
		state: machine.state || null,
		stateName: machine.stateName || null,
		storeCheckRemark: machine.storeCheckRemark || null,
		storeCheckResults: machine.storeCheckResults || [],
		subState: machine.subState || null,
		subStateName: machine.subStateName || null,
		type: machine.machineTypeId || null,
		typeName: machine.machineTypeDesc || null,
		workCheckRemark: machine.workCheckRemark || null,
		workCheckResults: machine.workCheckResults || [],
		workInId: machine.workInId || null,
		fenceId: machine.fenceId || null,
		driveType: machine.driveType || null,
		driveTypeName: machine.driveTypeName || null,

	}

};
