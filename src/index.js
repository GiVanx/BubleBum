import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Square extends React.Component {

    render() {

        return (
        <button className="square" onClick={this.props.onClick} 
            style={{
                left: this.props.x,
                top: this.props.y,
                height: this.props.dim,
                width: this.props.dim,
                background: this.props.color,
            }}
        >
            {this.props.value}
        </button>
        );
    }
}


class Game extends React.Component {

    squareColors = ['blue', 'red', 'yellow'];

    constructor(props) {
        super(props);

        this.state = {
            currentScore: 0,
            squares: new Map(),
        };

        this.gameArea = React.createRef();
        this.squareDim = 50;
        this.squareSpeed = 1;
        this.currentBorderColor = 0;
    }

    update() {

        let squares = this.cloneMap(this.state.squares);

        if (Math.random() > 0.9) {

            let newSquare = {
                x: this.getRandomDouble(0, this.gameArea.clientWidth - this.squareDim), 
                y: -1, 
                dim: this.squareDim,
                color: this.squareColors[this.getRandomInt(0, this.squareColors.length)],
            };
            let newSquareId = Math.random();

            squares.set(newSquareId, newSquare);
        }

        for (const [key, value] of squares.entries()) {
            value.y += this.squareSpeed;
            
            if (value.y > this.gameArea.clientHeight - this.squareDim) {
                squares.delete(key);
            } else {
                squares.set(key, value);
            }
        }

        this.setState({
            currentScore: this.currentScore,
            squares: squares,
        })

        requestAnimationFrame(() => this.update());
    }

    componentDidMount() {

        console.log("game area: " + this.gameArea);
        
        document.addEventListener('mousedown', this.handleClick, false);
        this.update();
    }
    
    handleClick = (e) => {

        console.log("game area: " + this.gameArea);

        // check if click outside game area
        if (!this.gameArea.contains(e.target)) {
            this.gameArea.style.borderColor = this.squareColors[this.currentBorderColor];
            this.currentBorderColor = (this.currentBorderColor + 1) % this.squareColors.length;
        }
    }

    cloneMap(map) {

        let newMap = new Map();

        for (const key of map.keys()) {
            newMap.set(key, map.get(key));
        }

        return newMap;
    }
    
    handleSquareClick(key) {
        
        let squares = this.cloneMap(this.state.squares);
        squares.delete(key);

        this.setState({
            currentScore: this.state.currentScore + 1,
            squares: squares,
        });
    }

    renderObject(key) {

        let square2Render = this.state.squares.get(key);
        
        return (
            <Square 
                    key={key}
                    x={square2Render.x}
                    y={square2Render.y}
                    dim={square2Render.dim}
                    color={square2Render.color}
                    onClick={() => this.handleSquareClick(key)}
            />
        );
    }

    getRandomDouble(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    render() {

        let squareComponents = [];

        for (const key of this.state.squares.keys()) {

            squareComponents.push(
                this.renderObject(key))
        }

        return (
            <div ref={gameArea => this.gameArea = gameArea} className="game-area">
                {/* {squareComponents} */}
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
