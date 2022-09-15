import LayoutComponent from "./layout";
import Signup from "../pages/Signup";
import AddProgram from "./AddProgram";
import Addtask from "./addtask";
import { Row, Col, Card } from "antd";
import AddStudy from "./AddStudy";
import '../styles/CSS/Mobile.css'
import { UserAddOutlined } from '@ant-design/icons'
const Dashboard = () => {
  return (
    <div>
      <LayoutComponent>
        <div className="site-card-wrapper">
          <Row gutter={16} className='createMobile'>
            <Col className="gutter-row" span={6}>
              <Card className="createMobileCard"
                style={{
                  borderRadius: "10px",
                  fontStyle: "Montserrat",
                  marginTop: 16,
                }}
                title="Create User"
              >
                <Signup />
              </Card>
            </Col>
            <Col className="gutter-row" span={6}>
              <Card className="createMobileCard"
                style={{
                  borderRadius: "10px",
                  fontStyle: "Montserrat",
                  marginTop: 16,
                }}
                title="Create Program/Project"
              >
                <AddProgram />
              </Card>
            </Col>
            <Col className="gutter-row" span={6}>
              <Card className="createMobileCard"
                style={{
                  borderRadius: "10px",
                  fontStyle: "Montserrat",
                  marginTop: 16,
                }}
                title="Create Study"
              >
                <AddStudy />
              </Card>
            </Col>
            <Col className="gutter-row" span={6}>
              <Card className="createMobileCard"
                style={{
                  borderRadius: "10px",
                  fontStyle: "Montserrat",
                  marginTop: 16,
                }}
                title="Create Task"
              >
                <Addtask />
              </Card>
            </Col>
          </Row>
        </div>
      </LayoutComponent>
    </div>
  );
};

export default Dashboard;
