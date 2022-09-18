package com.chefstory.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service @Slf4j public class Utils {

	public List subtract(final List list1, final List list2) {
		final ArrayList result = new ArrayList(list1);
		final Iterator iterator = list2.iterator();

		while (iterator.hasNext()) {
			result.remove(iterator.next());
		}

		return result;
	}

	public List intersect(final List list1, final List list2) {
		return (List) list1.stream().filter(t -> list2.contains(t)).collect(Collectors.toList());
	}
}
