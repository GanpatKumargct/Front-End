### Start the project 

```
npm create vite@latest
```

### Intiliaze the tailwind css 

```
npm install tailwindcss @tailwindcss/vite
```

### Configure the Vite plugin

```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

#### Import Tailwind CSS
Add an @import to your CSS file that imports Tailwind CSS.

```
@import "tailwindcss";
```

