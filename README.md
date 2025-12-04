# Global Threat Visualizer

A React-based application for visualizing global threats on an interactive 3D globe.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/mdobbs-cyber/globalthreat.git
    cd globalthreat
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the URL shown in your terminal).

## Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage

### Control Panel

The control panel provides various tools to customize the visualization and interact with external devices.

#### Visualization Controls
-   **Theme**: Toggle between different visual themes (e.g., Default, Cyberpunk, Minimal).
-   **Projection**: Change the map projection (Orthographic, Mercator, etc.).
-   **Data Layers**: Toggle different data layers (Satellites, Graticule, etc.).

#### Sliders
-   **SPIN**: Controls the rotation speed of the globe.
-   **LOAD**: Adjusts the intensity of simulated cyber attacks (max concurrent attacks).
-   **SATS**: Sets the number of satellites orbiting the globe.
-   **ZOOM**: Controls the camera zoom level.

#### WLED Integration
Sync your globe's visual theme with your room lighting using WLED.

1.  **Enter IP**: Input the IP address of your WLED-enabled device (e.g., `192.168.1.50`).
2.  **Test Connection**: Click the wifi icon to verify connectivity.
3.  **Controls**:
    -   **Brightness**: Adjust the LED brightness.
    -   **Effect**: Select from various WLED effects (Solid, Breathe, Rainbow, etc.).
4.  **Sync**: The WLED colors will automatically update to match the selected globe theme.

### Interaction
-   **Rotate**: Click and drag the globe to rotate it.
-   **Zoom**: Use the scroll wheel to zoom in and out.
-   **Hover**: Hover over data points to see more details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
