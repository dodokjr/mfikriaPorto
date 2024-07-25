import React, { useEffect, useState } from 'react'

export default async function getApiCall()
{
    const api = await fetch("http://localhost:5000/v1/")
    const data = await api.json()
    return data
}
