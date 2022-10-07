import { useLocation } from "@remix-run/react"
import qs from 'query-string'
import React from "react"

const QS_PARSE_OPTIONS: qs.ParseOptions = {
    arrayFormat: 'comma',
    parseBooleans: true,
    parseNumbers: true,
}

const QS_STRING_OPTIONS: qs.StringifyOptions = {
    arrayFormat: 'comma',
    skipEmptyString: true,
    skipNull: true,
}

export class QueryParams {
    private static getParam(request: Request, name: string): unknown {
        const parsed = qs.parseUrl(request.url, QS_PARSE_OPTIONS)
        return parsed.query[name] ?? undefined
    }

    public static getNumber(request: Request, name: string): number | undefined {
        const value = QueryParams.getParam(request, name)
        return typeof value === 'number' ? value : undefined
    }

    public static getBoolean(request: Request, name: string): boolean | undefined {
        const value = QueryParams.getParam(request, name)
        return typeof value === 'boolean' ? value : undefined
    }

    public static getArrayOfNumbers(request: Request, name: string): number[] | undefined {
        const value = QueryParams.getParam(request, name)
        if (value === undefined) return undefined
        return (Array.isArray(value) ? value : [value]).filter(v => typeof v === 'number')
    }
}

export const useQueryParams = () => {
    const location = useLocation()

    const mergeUrl = React.useCallback((params: Record<string, unknown>, url?: string) => {
        const existingParams = qs.parse(location.search, QS_PARSE_OPTIONS)
        const queryParams = qs.stringify({ ...existingParams, ...params }, QS_STRING_OPTIONS)
        return `${url ?? location.pathname}?${queryParams}`
    }, [location.pathname, location.search])

    const freshUrl = React.useCallback((params: Record<string, unknown>, url?: string) => {
        const queryParams = qs.stringify(params, QS_STRING_OPTIONS)
        return `${url ?? location.pathname}?${queryParams}`
    }, [location.pathname])

    const resetUrl = React.useCallback((url?: string) => {
        return url ?? location.pathname
    }, [location.pathname])

    return { mergeUrl, freshUrl, resetUrl }
}