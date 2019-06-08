import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Square extends React.Component {

    render() {

        return (
        <button className="square" onClick={this.props.onClick} 
            style={{
                position: "absolute", 
                left: this.props.x,
                top: this.props.y,
            }}
        >
            {this.props.value}
        </button>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentScore: 0,
            squares: new Map(),
        };
    }

    update() {

        let squares = this.cloneMap(this.state.squares);

        if (Math.random() > 0.9) {

            let newSquare = {x: this.getRandom(0, 600), y: -1};
            let newSquareId = Math.random();

            squares.set(newSquareId, newSquare);
        }

        for (const [key, value] of squares.entries()) {
            value.y += 2;
            
            if (value.y > 400) {
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

        this.update();
    }

    cloneMap(map) {
        let newMap = new Map();

        for (const key of map.keys()) {
            newMap.set(key, map.get(key));
        }

        return newMap;
    }
    
    handleObjectClick(key) {
        
        let squares = this.cloneMap(this.state.squares);
        squares.delete(key);

        this.setState({
            currentScore: this.state.currentScore + 1,
            squares: squares,
        });
    }

    renderObject(key) {
        return (
            <Square 
                    key={key}
                    x={this.state.squares.get(key).x}
                    y={this.state.squares.get(key).y}
                    onClick={() => this.handleObjectClick(key)}
            />
        );
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    render() {

        let squareComponents = [];

        for (const key of this.state.squares.keys()) {

            squareComponents.push(
                this.renderObject(key))
        }

        return (
            <div>
                {squareComponents}
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
