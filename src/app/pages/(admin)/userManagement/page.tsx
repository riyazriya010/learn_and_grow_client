import UserManagement from "@/components/admin/userManagement"

const UserManagementPage = () => {
    const users: any = [{username: 'Riyas', email:'riyas@gmail.com'}]
    return(
        <UserManagement users={users}/>
    )
}

export default UserManagementPage