import React, { Component } from 'react';
import CardInGame from './CardInGame';

function PlayDiagram(lines) {
    let source = lines[0].replace(/Uses /, '');
    source = source.slice(0, source.indexOf(' to play '));

    let target = lines[1].replace(/Plays /, '');
    if (target.indexOf(', gaining') !== -1) {
        target = target.slice(0, target.indexOf(', gaining'));
    }
    if (target.indexOf(', attaching') !== -1) {
        target = target.slice(0, target.indexOf(', attaching'));
    }

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <div
                style={{
                    marginRight: '10px'
                }}
            >
                <CardInGame name={source} action='Uses' />
            </div>
            <CardInGame name={target} action='to play' />
        </div>
    );
}

function CaptureDiagram(lines) {
    let source = lines[0].replace(/Uses /, '');
    source = source.slice(0, source.indexOf(' to capture '));

    const amount = lines[0].match(/\d* amber/);

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <div
                style={{
                    marginRight: '10px'
                }}
            >
                <CardInGame name={source} action='Uses' />
            </div>
            <div
                style={{
                    height: '22px',
                    fontSize: '17px',
                    borderRadius: '2px',
                    display: 'inline-block',
                    padding: '5px',
                    color: 'black',
                    marginTop: '10px',
                    marginRight: '10px',
                    minWidth: '48px',
                    textAlign: 'center'
                }}
            >
                {`to capture ${amount}`}
                <div
                    style={{
                        display: 'inline-block',
                        position: 'relative',
                        height: '16px',
                        width: '16px',
                        marginLeft: '4px',
                        marginRight: '4px'
                    }}
                >
                    <img
                        style={{
                            top: 0,
                            left: 0,
                            margin: 0,
                            width: '20px',
                            position: 'absolute'
                        }}
                        src='/aember.png'
                    />
                </div>
            </div>
        </div>
    );
}

function UpgradeDiagram(lines) {
    let source = lines[0].replace(/Plays /, '');

    if (source.indexOf(', gaining') !== -1) {
        source = source.slice(0, source.indexOf(', gaining'));
    }
    if (source.indexOf(', attaching') !== -1) {
        source = source.slice(0, source.indexOf(', attaching'));
    }

    const target = lines[0].slice(
        lines[0].indexOf(' attaching it to ') + ' attaching it to '.length
    );

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <div
                style={{
                    marginRight: '10px'
                }}
            >
                <CardInGame name={source} action='Plays' />
            </div>
            <CardInGame name={target} action='and attaches it to' />
        </div>
    );
}

class Diagram extends Component {
    constructor() {
        super();
        this.state = { hasError: false };
    }

    componentDidCatch(error) {
        console.log('error', error);
        this.setState({ hasError: true });
    }

    render() {
        const { lines } = this.props;

        if (this.state.hasError) {
            return <div>{lines.map((l) => l)}</div>;
        }

        let diagram = null;
        const source = lines[0];

        if (source.indexOf(' to play ') !== -1) {
            diagram = PlayDiagram(lines);
        }

        if (source.indexOf(' to capture ') !== -1) {
            diagram = CaptureDiagram(lines);
        }

        if (source.indexOf(' to destroy ') !== -1) {
            diagram = DestroyDiagram(lines);
        }

        if (source.indexOf(' attaching it to ') !== -1) {
            diagram = UpgradeDiagram(lines);
        }

        return diagram;
    }
}

export default Diagram;
