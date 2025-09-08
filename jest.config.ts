import { createDefaultEsmPreset } from "ts-jest"

const preset = createDefaultEsmPreset()

export default {
	...preset,
	moduleNameMapper:{
		"^../src/(.*)\.js$": "<rootDir>/src/$1.ts"
	}
}
