import Loader from "../Loader";
import {Dashboard} from "./Dashboard";
import {connect} from "react-redux";
import {getProfile} from "../../redux/userReducer";

const DashboardContainer = ({profile}) => {
    if (!profile) {
        return <Loader/>
    } else {
        return <Dashboard role = {profile.role}/>
    }
}
const mapStateToProps = state => ({
    profile: state.user.profile,
})
export default connect(mapStateToProps, {getProfile})(DashboardContainer);

