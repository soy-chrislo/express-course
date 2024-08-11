# Typescript Odyssey


1. Transpile Typescript to Javascript.
```bash
$ pnpm i -D typescript ts-node @types/node
$ npx tsc --init
```

2. Starter `tsconfig.json`.
```json
{
	"compilerOptions": {
    "outDir": "./dist"
  },
	"include": ["src"],
	"exclude": ["node_modules"]
}
```
3. Generate Javascript.
```bash
$ npx tsc

.
├── dist
│   └── index.js
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── src
│   └── index.ts
├── tsconfig.json
```

4. Execute Typescript directly using `ts-node`.
```bash
$ npx ts-node src/index.ts
```

## Configure path aliases (for javascript runtime)

5. Configure alises in `tsconfig.json`.

```json
{
	...
	"compilerOptions": {
		...
		"paths": {
			"@/*": ["src/*"]
		}
	},
	...
}
```

6. To avoid unknown module "@", it's necessary to install `module-alias` as production dependency.
```bash
$ pnpm i --save module-alias
```

7. Configure aliases in `package.json` depending on transpiled folder.
```json
{
  ...
  "_moduleAliases": {
    "@": "./dist"   // --> "@/*": ["src/*"]
  }
}
```

6. At this point, also works with `npx ts-node`.

## Configure Nodemon
7. Installation and configuration.
```bash
$ pnpm install -D nodemon
```

8. At this point, works out of the box.
```bash
$ npx nodemon ./src/index.ts
```

## Using modern versions (both Ts and Js)
9. Modify `tsconfig.json`.
```json
"module": "ES2022",
"moduleResolution": "node",
"target": "ES2022",
"esModuleInterop": true,
```

10. New version, breaks *alias path*, it's necessary add `.js` at the end of each import, tsc and nodemon out of the box breaks with unknown file extension ".ts" error.
```ts
import { variable } from "./variables"; ❌
import { variable } from "./variables.js"; ✅
```

11. ts-node solution and change in `package.json`:
```bash
$ node --loader ts-node/esm src/index.ts
```
```json
{
	...
	"scripts": {
		...
		"dev": "ts-node ./src/index.ts", ❌
		"dev": "node --loader ts-node/esm src/index.ts", ✅
		...
	},
	...
}
```

12. Nodemon should be used with a new command as ts-node:
```json
{
	...
	"scripts": {
		...
		"dev:wtch": "nodemon ./src/index.ts", ❌
		"dev:watch": "nodemon --exec \"node --inspect --loader ts-node/esm\" ./src/index.ts", ✅
		...
	},
	...
}
```

13. To solve *path aliases* once Typescript code is transpiled (production), install `tsconfig-replace-paths`.
```bash
$ pnpm install --save-dev tsconfig-replace-paths
```
```json
{
	...
	"scripts": {
		...
		"build": "rm -rf ./dist && tsc", ❌
		"build": "tsc --project tsconfig.json && tsconfig-replace-paths --project tsconfig.json", ✅
		...
	},
	...
}
```
```json
{
	"compilerOptions": {
		...
		"rootDir": "./src",
		"incremental": false, ✅ // or remove
		...
	}
}
```
14.  At this point, looks tsconfig-paths doesn't support ESModules, so I'll use tsx.

```bash
$ pnpm i -D tsx
```

```json
{
	...
	"scripts": {
		...
		"dev": "node --loader ts-node/esm src/index.ts", ❌
		"dev": "tsx src/index.ts", ✅
		"dev:watch": "nodemon --exec \"node --inspect --loader ts-node/esm\" ./src/index.ts", ❌
		"dev:watch": "nodemon --exec \"tsx\" ./src/index.ts" ✅
		...
	},
	...
}
```