import React, {memo, useCallback} from "react";
import axios from "axios";
import styled from "styled-components";

import Input from "@components/UI/atoms/Input";
import Label from "@components/UI/atoms/Label";
import color from "@/constant/color";

const FileWrapper = styled.div`
    overflow: hidden;
`;

const StyledTextInput = styled(Input)`
    float: left;
    width: calc(100% - 110px);
    height: 45px;
    margin-right: 10px;
`;

const StyledLabel = styled(Label)`
    float: left;
    width: 100px;
    height: 45px;
    border: 1px solid ${color.borderColor};
`;

const StyledFileInput = styled(Input)`
    display: none;
`;

const FileUpload = memo(({
    url,
    file,
    placeholder,
    setFile
}) => {
    const {name} = file;

    const handleSubmit = useCallback((event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        axios.post(url, formData).then(res => {
            setFile(res.data.file);
            alert('업로드 성공');
        }).catch(err => {
            alert('업로드 실패');
        });
    }, [setFile]);

    return (
        <FileWrapper>
            <StyledTextInput type="text"
                             value={name || ''}
                             placeholder={placeholder}
                             readOnly/>
            <StyledLabel htmlFor="file"/>
            <StyledFileInput type="file"
                             id="file"
                             readOnly
                             onChange={handleSubmit}/>
        </FileWrapper>
    )
});

export default FileUpload;