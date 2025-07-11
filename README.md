# BO4 Speedrun Helper

A high-performance web application to help speedrunners track essential data while playing Call of Duty: Black Ops 4 Zombies maps. Built with React + Vite for instantaneous interactions and optimal speedrunning efficiency.

## Features

- **Lightning-fast interface** - Built with React + Vite for sub-second response times
- **Offline-capable** - All data stored locally, no internet required during runs
- **Mobile-friendly** - Responsive design works on all devices
- **Data persistence** - Your data is automatically saved and restored between sessions

### Currently Supported Maps

- **Voyage of Despair** - Track clocks (locations, times, symbols), outlet locations with catalyst types, and planet order

## Live Demo

Visit the live app: [https://bo4-sr-tool.com/](https://bo4-sr-tool.com/)

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bo4-sr-helper.git
cd bo4-sr-helper
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages (manual)

## Deployment

### Automatic Deployment (Recommended)

The app automatically deploys to GitHub Pages when you push to the main branch. Make sure to:

1. Enable GitHub Pages in your repository settings
2. Set the source to "GitHub Actions"
3. The workflow will handle the rest!

### Manual Deployment

```bash
npm run deploy
```

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router DOM
- **Styling:** CSS with CSS Variables
- **Storage:** localStorage for data persistence
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions

## Performance Features

- **Minimal bundle size** - Optimized Vite build
- **Fast startup** - No unnecessary dependencies
- **Instant interactions** - Optimized React components
- **Efficient re-renders** - Smart state management
- **Local storage** - No network requests during gameplay

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-map`
3. Make your changes
4. Commit your changes: `git commit -am 'Add new map support'`
5. Push to the branch: `git push origin feature/new-map`
6. Submit a pull request

## Roadmap

- [ ] Add Blood of the Dead map support
- [ ] Add IX map support
- [ ] Image support for locations
- [ ] Export data functionality
- [ ] Speedrun timer integration
- [ ] Dark mode theme

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/yourusername/bo4-sr-helper/issues) on GitHub.
