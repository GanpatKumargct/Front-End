// vite.config.ts
import { defineConfig } from "file:///E:/Front%20End/New%20folder/frontend/node_modules/vite/dist/node/index.js";
import path from "path";
import react from "file:///E:/Front%20End/New%20folder/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///E:/Front%20End/New%20folder/frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\Front End\\New folder\\frontend";
function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__vite_injected_original_dirname, "src/assets", filename);
      }
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  assetsInclude: ["**/*.svg", "**/*.csv"]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxGcm9udCBFbmRcXFxcTmV3IGZvbGRlclxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRnJvbnQgRW5kXFxcXE5ldyBmb2xkZXJcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Zyb250JTIwRW5kL05ldyUyMGZvbGRlci9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xuXG5mdW5jdGlvbiBmaWdtYUFzc2V0UmVzb2x2ZXIoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2ZpZ21hLWFzc2V0LXJlc29sdmVyJyxcbiAgICByZXNvbHZlSWQoaWQ6IHN0cmluZykge1xuICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoJ2ZpZ21hOmFzc2V0LycpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gaWQucmVwbGFjZSgnZmlnbWE6YXNzZXQvJywgJycpXG4gICAgICAgIHJldHVybiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2Fzc2V0cycsIGZpbGVuYW1lKVxuICAgICAgfVxuICAgIH0sXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIGZpZ21hQXNzZXRSZXNvbHZlcigpLFxuICAgIHJlYWN0KCksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGFzc2V0c0luY2x1ZGU6IFsnKiovKi5zdmcnLCAnKiovKi5jc3YnXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLFNBQVMsb0JBQW9CO0FBQzNULE9BQU8sVUFBVTtBQUNqQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFIeEIsSUFBTSxtQ0FBbUM7QUFLekMsU0FBUyxxQkFBcUI7QUFDNUIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sVUFBVSxJQUFZO0FBQ3BCLFVBQUksR0FBRyxXQUFXLGNBQWMsR0FBRztBQUNqQyxjQUFNLFdBQVcsR0FBRyxRQUFRLGdCQUFnQixFQUFFO0FBQzlDLGVBQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWMsUUFBUTtBQUFBLE1BQ3ZEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLG1CQUFtQjtBQUFBLElBQ25CLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlLENBQUMsWUFBWSxVQUFVO0FBQ3hDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
