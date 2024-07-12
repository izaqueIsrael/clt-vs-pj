// src/pages/index.tsx
import React, { Component } from "react";
import GrossToNet from "../components/GrossToNet";
import NetToGross from "../components/NetToGross";
import PJSalaryComparative from "../components/PJSalaryComparative";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Head from "next/head";

interface State {
  activeComponent: string;
}

class Home extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeComponent: "netToGross",
    };
  }

  setActiveComponent = (component: string) => {
    this.setState({ activeComponent: component });
  };

  renderComponent = () => {
    const { activeComponent } = this.state;
    switch (activeComponent) {
      case "netToGross":
        return <NetToGross />;
      case "pjSalaryComparative":
        return <PJSalaryComparative />;
      case "grossToNet":
        return <GrossToNet />;
      default:
        return <NetToGross />;
    }
  };

  render() {
    return (
      <>
        <Head>
          <title>Calculadoras</title>
        </Head>
        <section className="p-5 flex flex-col items-center gap-4">
          <Header />
          <div className="flex flex-col items-center justify-between">
            <Navigation setActiveComponent={this.setActiveComponent} />
          </div>
          {this.renderComponent()}
        </section>
      </>
    );
  }
}

export default Home;
