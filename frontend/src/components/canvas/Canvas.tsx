import { h, Component } from 'preact';

class Canvas extends Component {
    private gameCanvas: HTMLCanvasElement | undefined;

    componentDidMount() {

        this.gameCanvas = document.createElement('canvas');
        this.gameCanvas.width = 500;
        this.gameCanvas.height = 500;
    }



    render() {
        return <canvas />;
    }
}

export default Canvas;