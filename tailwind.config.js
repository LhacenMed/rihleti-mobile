/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./App.tsx",
    ],

    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Core colors
                background: "rgb(var(--background))",
                foreground: "rgb(var(--foreground))",
                card: {
                    DEFAULT: "rgb(var(--card))",
                    foreground: "rgb(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "rgb(var(--popover))",
                    foreground: "rgb(var(--popover-foreground))",
                },

                // Brand colors
                primary: {
                    DEFAULT: "rgb(var(--primary))",
                    foreground: "rgb(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "rgb(var(--secondary))",
                    foreground: "rgb(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "rgb(var(--muted))",
                    foreground: "rgb(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "rgb(var(--accent))",
                    foreground: "rgb(var(--accent-foreground))",
                },

                // State colors
                destructive: {
                    DEFAULT: "rgb(var(--destructive))",
                    foreground: "rgb(var(--destructive-foreground))",
                },
                success: {
                    DEFAULT: "rgb(var(--success))",
                    foreground: "rgb(var(--success-foreground))",
                },
                warning: {
                    DEFAULT: "rgb(var(--warning))",
                    foreground: "rgb(var(--warning-foreground))",
                },

                // UI elements
                border: "rgb(var(--border))",
                input: "rgb(var(--input))",
                ring: "rgb(var(--ring))",

                // Specialized components
                sidebar: {
                    DEFAULT: "rgb(var(--sidebar-background))",
                    foreground: "rgb(var(--sidebar-foreground))",
                    primary: "rgb(var(--sidebar-primary))",
                    "primary-foreground": "rgb(var(--sidebar-primary-foreground))",
                    accent: "rgb(var(--sidebar-accent))",
                    "accent-foreground": "rgb(var(--sidebar-accent-foreground))",
                    border: "rgb(var(--sidebar-border))",
                },

                // Custom app colors
                seat: {
                    window: "rgb(var(--seat-window))",
                    aisle: "rgb(var(--seat-aisle))",
                    middle: "rgb(var(--seat-middle))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
};